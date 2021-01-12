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
    // exemplo: 01.01.01.01 -> 01.01.01.01 (todos lideres tecnicos)
    // exemplo: 01.01.01.01.01 -> último nível só será avaliado
    // esses acima vão avaliar, e serão avaliados

    // Ir descendo o nível até achar um nível que tenha funcionários

    /* TODO:
    - Verificar os usuário que não tiveram o ciclo criado
    - Verificar se o setor possui um coordenador ou lider
    */

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
    const childrenDepartments = departmentjson.filter(
      (dep) =>
        (dep.level.split('.').length === leaderDepartmentLevelLength + 1 &&
          dep.level.split('.')[dep.level.split('.').length - 2] ===
            leaderDepartmentLevel.split('.')[leaderDepartmentLevelLength - 1] &&
          dep.level.split('.')[dep.level.split('.').length - 3] ===
            leaderDepartmentLevel.split('.')[leaderDepartmentLevelLength - 2]) ||
        dep.id === auth.user.department_id
    );

    let trueLeaders = [];

    // Quando o coordenador não tem outros setores abaixo
    // if (childrenDepartments.length === 0 && leaderLevelLength !== 6) {
    //   // Pegando todos os colaboradores do setor
    //   const employees = await User.query()
    //     .where({ department_id: auth.user.department_id })
    //     .where('id', '<>', auth.user.id)
    //     .where({ active: true })
    //     .with('departments')
    //     .with('positions', (builder) => {
    //       builder.with('paths');
    //     })
    //     .with('hierarchies')
    //     .with('evaluationCycleAnswers')
    //     .withCount('evaluationCycleAnswers', (builder) => {
    //       builder.orWhere('leader_finished', false).orWhere('leader_finished', null);
    //     })
    //     .withCount('evaluationCycleJustificatives', (builder) => {
    //       builder.orWhere('leader_finished', false).orWhere('leader_finished', null);
    //     })
    //     .withCount('evaluationCycleComments', (builder) => {
    //       builder.orWhere('leader_finished', false).orWhere('leader_finished', null);
    //     })
    //     .orderBy('name', 'asc')
    //     .fetch();
    //   trueLeaders.push(employees);
    // }

    // Pegando todos os gerente, ou coordenadores, ou lideres dos setores de acordo com o fluxo
    const departmentEmployees = childrenDepartments.map(async (children) => {
      const employees = await User.query()
        .where({ department_id: children.id })
        .where('id', '<>', auth.user.id)
        .where({ active: true })
        .with('departments')
        .with('positions', (builder) => {
          builder.with('paths');
        })
        .with('hierarchies')
        .with('evaluationCycleAnswers')
        .withCount('evaluationCycleAnswers', (builder) => {
          builder.orWhere('leader_finished', false).orWhere('leader_finished', null);
        })
        .withCount('evaluationCycleJustificatives', (builder) => {
          builder.orWhere('leader_finished', false).orWhere('leader_finished', null);
        })
        .withCount('evaluationCycleComments', (builder) => {
          builder.orWhere('leader_finished', false).orWhere('leader_finished', null);
        })
        .orderBy('name', 'asc')
        .fetch();
      return employees.toJSON();
    });

    const departmentoEmployeesAwait = await Promise.all(departmentEmployees);

    const departmentoEmployeesWithoutNulls = departmentoEmployeesAwait.filter((item) => item.length > 0).flat();

    const departmentsWithLeader = departmentoEmployeesWithoutNulls
      .filter((employee) => employee.hierarchies?.level.split('.').length === 4)
      .map((obj) => obj.departments.id);

    // Superintendente = 1 || Gerentes = 2 || Coordenadores 3 || Lider 4 || Líder Técnico 5 || Operacional 6

    switch (leaderLevelLength) {
      case 1:
        trueLeaders = departmentoEmployeesWithoutNulls.filter(
          (item) =>
            item.hierarchies?.level.split('.').length > 1 &&
            item.hierarchies?.level.split('.').length <= 3 &&
            item.id !== auth.user.id
        );
        break;
      case 2:
        trueLeaders = departmentoEmployeesWithoutNulls.filter(
          (item) =>
            (item.hierarchies?.level.split('.').length === 3 || item.hierarchies?.level.split('.').length === 4) &&
            item.id !== auth.user.id
        );
        break;
      case 3:
        trueLeaders = departmentoEmployeesWithoutNulls.filter(
          (item) =>
            (item.hierarchies?.level.split('.').length === 4 || item.hierarchies?.level.split('.').length === 6) &&
            item.id !== auth.user.id &&
            (!departmentsWithLeader.includes(item.departments.id) || item.hierarchies?.level.split('.').length === 4)
        );
        break;
      case 4:
        trueLeaders = departmentoEmployeesWithoutNulls.filter(
          (item) =>
            (item.hierarchies?.level.split('.').length === 5 || item.hierarchies?.level.split('.').length === 6) &&
            item.id !== auth.user.id
        );
        break;
      case 5:
        trueLeaders = departmentoEmployeesWithoutNulls.filter(
          (item) => item.hierarchies?.level.split('.').length === 6 && item.id !== auth.user.id
        );
        break;
      default:
        break;
    }

    return trueLeaders;
  }
}

module.exports = DepartmentEmployeeController;
