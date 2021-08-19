/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Department = use('App/Models/Department');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Hierarchy = use('App/Models/Hierarchy');

class ContinuousFeedbackAreaEmployeesController {
  async show({ params, response }) {
    try {
      const employeeContinuousFeedback = await User.query()
        .where({ id: params.id })
        .select('id', 'name', 'admitted_at', 'position_id', 'hierarchy_id', 'department_id')
        .first();

      await employeeContinuousFeedback.loadMany({
        continuousFeedbacks: (continuousFeedback) =>
          continuousFeedback
            .select(['id', 'employee_id', 'category', 'description', 'visible_to_employee', 'created_at'])
            .with('continuousFeedbackDevelopmentPlans', (builder) =>
              builder.select([
                'id',
                'continuous_feedback_id',
                'employee_id',
                'leader_id',
                'action',
                'initial_date',
                'final_date',
                'fake_id',
              ])
            )
            .orderBy('created_at', 'desc'),
        positions: (position) =>
          position.select(['id', 'description', 'path_id']).with('paths', (path) => path.select(['id', 'description'])),
        hierarchies: (hierarchy) => hierarchy.select(['id', 'description', 'level']),
        departments: (department) => department.select(['id', 'name']),
      });

      return employeeContinuousFeedback;
    } catch (err) {
      return response.status(500).json({ message: err.message });
    }
  }

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
          .with('continuousFeedbacks', (continuousFeecback) => {
            continuousFeecback
              .select(['id', 'employee_id', 'category', 'description', 'visible_to_employee', 'insignia'])
              .with('continuousFeedbackDevelopmentPlans', (continuousFeedbackDevelopmentPlan) => {
                continuousFeedbackDevelopmentPlan.select([
                  'id',
                  'employee_id',
                  'continuous_feedback_id',
                  'action',
                  'status',
                  'fake_id',
                ]);
              });
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

module.exports = ContinuousFeedbackAreaEmployeesController;
