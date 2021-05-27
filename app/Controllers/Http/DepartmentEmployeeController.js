/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Department = use('App/Models/Department');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Hierarchy = use('App/Models/Hierarchy');

class DepartmentEmployeeController {
  async index({ auth }) {
    // Identificar a hierarquia do usuário que está acessando no momento, isso também no dashboard
    // Verificar as áreas que estão imediatamente sob essa hierarquia ou seja tenha o tamanho do array do split com ponto + 1
    // Pegar os usuários desses setores que fazem parte dessa hierarquia
    // exemplo: 01 -> 01.01 (todos gerentes)
    // exemplo: 01.01 -> 01.01.01 (todos coordenadores)
    // exemplo: 01.01.01 -> 01.01.01.01(todos lideres)
    // exemplo: 01.01.01.01 -> 01.01.01.01.01 (todos lideres tecnicos)
    // exemplo: 01.01.01.01.01 -> último nível só será avaliado
    // esses acima vão avaliar, e serão avaliados

    // Ir descendo o nível até achar um nível que tenha funcionários

    // Verificando a hierarquia do líder que está acessando
    const hierarchy = await Hierarchy.find(auth.user.hierarchy_id);
    const hierarchyjson = hierarchy.toJSON();
    const leaderLevel = hierarchyjson.level;
    const leaderLevelLength = leaderLevel.split('.').length;

    // Se ele for Administrativo/Operacional já retornar imediatamente
    if (leaderLevelLength === 6) return [];

    // Pegando o departamento do líder que está acessando
    const leaderDepartment = await Department.find(auth.user.department_id);
    const leaderDepartmentjson = leaderDepartment.toJSON();
    const leaderDepartmentLevel = leaderDepartmentjson.level;
    const leaderDepartmentLevelLength = leaderDepartmentLevel.split('.').length;

    // Listando as áreas que fazem parte do fluxo de análise do líder
    const department = await Department.all();
    const departmentjson = department.toJSON();

    const childrenDepartments = departmentjson
      .filter(
        (dep) =>
          (dep.level.split('.').length >= leaderDepartmentLevelLength + 1 &&
            dep.level.split('.')[
              dep.level.split('.').length - (dep.level.split('.').length - (leaderDepartmentLevelLength + 1) + 2)
            ] === leaderDepartmentLevel.split('.')[leaderDepartmentLevelLength - 1] &&
            dep.level.split('.')[
              dep.level.split('.').length - (dep.level.split('.').length - (leaderDepartmentLevelLength + 1) + 3)
            ] === leaderDepartmentLevel.split('.')[leaderDepartmentLevelLength - 2]) ||
          dep.id === auth.user.department_id
      )
      .flat();

    // Pegando todos os gerente, ou coordenadores, ou lideres dos setores de acordo com o fluxo
    let employeeList = [];
    const departmentEmployees = await Promise.all(
      childrenDepartments.map(async (departmentChildren) => {
        const employees = await User.query()
          // .select(['active', 'company_id', 'department_id', 'email', 'hierarchy_id', 'name', 'position_id'])
          .where({ department_id: departmentChildren.id })
          .where('id', '<>', auth.user.id)
          .where({ active: true })
          .with('departments', (builder) => {
            builder.select(['id', 'active', 'leader_id', 'level', 'name']);
          })
          .with('positions', (builder) => {
            builder.select(['id', 'path_id', 'description']);
            builder.with('paths', (builderChildren) => {
              builderChildren.select(['id', 'description']);
            });
          })
          .with('hierarchies', (builder) => {
            builder.select(['id', 'description', 'level', 'active']);
          })
          .with('evaluationCycleAnswers', (builder) => {
            builder.select([
              'behavior_id',
              'employee_id',
              'evaluation_cycle_id',
              'form_id',
              'id',
              'leader_answer',
              'leader_finished',
              'leader_id',
            ]);
          })
          .withCount('evaluationCycleAnswers as employeeEvaluationAnswers', (builder) => {
            builder.whereRaw('(user_finished = 0 or user_finished is null)'); // ({ user_finished: false }).orWhere({ user_finished: null });
          })
          .withCount('evaluationCycleJustificatives as employeeEvaluationJustificatives', (builder) => {
            builder.whereRaw('(user_finished = 0 or user_finished is null)'); // ({ user_finished: false }).orWhere({ user_finished: null });
          })
          .withCount('evaluationCycleAnswers as leaderAnswers', (builder) => {
            builder.whereRaw('(leader_finished = 0 or leader_finished is null)'); // orWhere('leader_finished', 0).orWhere('leader_finished', null);
          })
          .withCount('evaluationCycleJustificatives as leaderJustificatives', (builder) => {
            builder.whereRaw('(leader_finished = 0 or leader_finished is null)'); // orWhere('leader_finished', 0).orWhere('leader_finished', null);
          })
          .withCount('evaluationCycleComments as leaderFeedback', (builder) => {
            builder.whereRaw('(leader_finished = 0 or leader_finished is null)'); // orWhere('leader_finished', 0).orWhere('leader_finished', null);
          })
          .orderBy('name', 'asc')
          .fetch();
        return employees.toJSON();
      })
    );

    const departmentoEmployeesWithoutNulls = departmentEmployees.filter((item) => item.length > 0).flat();

    // Talvez seja interessante aqui verificar se há coordenador, lider e lider técnico no setor
    const leaders = [3, 4, 5];
    const departmentsWithLeader = departmentoEmployeesWithoutNulls
      .filter(
        (employee) =>
          leaders.includes(employee.hierarchies.level.split('.').length) && employee.department_id !== auth.user.department_id
      )
      .map((obj) => obj.departments);

    const childrenWithLeader = childrenDepartments
      .filter(
        (depart) =>
          departmentsWithLeader.filter((dep) => dep.level === depart.level.substring(0, depart.level.length - 3)).length > 0
      )
      .map((depart) => depart.id);

    const parentWithLeader = departmentsWithLeader.map((depart) => depart.id);

    switch (leaderLevelLength) {
      case 1:
        employeeList = departmentoEmployeesWithoutNulls.filter(
          (item) =>
            item.id !== auth.user.id &&
            item.departments.level.split('.').length === 2 &&
            ((!childrenWithLeader.includes(item.departments.id) && !parentWithLeader.includes(item.departments.id)) ||
              leaders.includes(item.hierarchies?.level.split('.').length))
        );
        break;
      case 2:
        employeeList = departmentoEmployeesWithoutNulls.filter(
          (item) =>
            (item.id !== auth.user.id &&
              item.departments.level.split('.').length === 3 &&
              !childrenWithLeader.includes(item.departments.id) &&
              !parentWithLeader.includes(item.departments.id)) ||
            leaders.includes(item.hierarchies?.level.split('.').length)
        );
        break;
      case 3:
        employeeList = departmentoEmployeesWithoutNulls.filter(
          (item) =>
            item.id !== auth.user.id &&
            ((!childrenWithLeader.includes(item.departments.id) && !parentWithLeader.includes(item.departments.id)) ||
              item.hierarchies?.level.split('.').length === 4)
        );
        break;
      default:
        employeeList = departmentoEmployeesWithoutNulls.filter(
          (item) => item.id !== auth.user.id && item.departments.level.split('.').length >= leaderDepartmentLevelLength
        );
        break;
    }

    return employeeList.map((employee) => {
      const {
        cpf,
        admitted_at,
        avatar,
        avatar_url,
        created_at,
        email,
        fired_at,
        password,
        password_updated_at,
        registry,
        updated_at,
        user_group_id,
        username,
        ...data
      } = employee;
      return data;
    });
  }
}

module.exports = DepartmentEmployeeController;
