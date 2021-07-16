/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Department = use('App/Models/Department');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Hierarchy = use('App/Models/Hierarchy');

class ConsolidatedEvaluationCycleDevelopmentPlanController {
  async index({ auth }) {
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
          .select(['id', 'active', 'company_id', 'department_id', 'email', 'hierarchy_id', 'name', 'position_id'])
          .where({ department_id: departmentChildren.id })
          .where('id', '<>', auth.user.id)
          .where({ active: true })
          .with('departments', (builder) => {
            builder.select(['id', 'active', 'leader_id', 'level', 'name']);
          })
          .with('hierarchies', (builder) => {
            builder.select(['id', 'description', 'level', 'active']);
          })
          .with('evaluationCycleDevelopmentPlans', (builder) => {
            builder.with('developmentPlans');
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

  async show({ auth }) {
    return User.query()
      .select(['id', 'active', 'company_id', 'department_id', 'email', 'hierarchy_id', 'name', 'position_id'])
      .where('id', auth.user.id)
      .where({ active: true })
      .with('evaluationCycleDevelopmentPlans', (builder) => {
        builder.with('developmentPlans');
      })
      .orderBy('name', 'asc')
      .first();
  }
}

module.exports = ConsolidatedEvaluationCycleDevelopmentPlanController;
