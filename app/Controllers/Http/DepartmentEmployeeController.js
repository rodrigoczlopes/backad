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
    */

    // Verificando a hierarquia do líder que está acessando
    const hierarchy = await Hierarchy.find(auth.user.hierarchy_id);
    const hierarchyjson = hierarchy.toJSON();
    const leaderLevel = hierarchyjson.level;
    const leaderLevelLength = leaderLevel.split('.').length;

    // Pegando o departamento do líder que está acessando
    const leaderDepartment = await Department.find(auth.user.department_id);
    const leaderDepartmentjson = leaderDepartment.toJSON();
    const leaderDepartmentLevel = leaderDepartmentjson.level;

    // Listando as áreas que fazem parte do fluxo de análise do líder
    const department = await Department.all();
    const departmentjson = department.toJSON();
    const childrenDepartments = departmentjson.filter(
      (dep) =>
        dep.level.split('.').length === leaderLevelLength + 1 &&
        dep.level.split('.')[leaderLevelLength - 1] === leaderDepartmentLevel.split('.')[leaderLevelLength - 1]
    );

    if (childrenDepartments.length === 0) {
      // Pegando todos os colaboradores do setor
      const employees = await User.query()
        .where({ department_id: auth.user.department_id })
        .where('id', '<>', auth.user.id)
        .where({ active: true })
        .with('departments')
        .with('positions', (builder) => {
          builder.with('paths');
        })
        .with('hierarchies')
        .withCount('evaluationCycleAnswers', (builder) => {
          builder.where('leader_finished', false);
        })
        .withCount('evaluationCycleJustificatives', (builder) => {
          builder.where('leader_finished', false);
        })
        .withCount('evaluationCycleComments', (builder) => {
          builder.where('leader_finished', false);
        })
        .orderBy('name', 'asc')
        .fetch();
      return employees;
    }

    // Pegando todos os gerente, ou coordenadores, ou lideres dos setores de acordo com o fluxo
    const leaders = childrenDepartments.map(async (children) => {
      const employees = await User.query()
        .where({ department_id: children.id })
        .where({ active: true })
        .with('departments')
        .with('positions', (builder) => {
          builder.with('paths');
        })
        .with('hierarchies')
        .withCount('evaluationCycleAnswers', (builder) => {
          builder.where('leader_finished', false);
        })
        .withCount('evaluationCycleJustificatives', (builder) => {
          builder.where('leader_finished', false);
        })
        .withCount('evaluationCycleComments', (builder) => {
          builder.where('leader_finished', false);
        })
        .orderBy('name', 'asc')
        .fetch();
      return employees.toJSON();
    });

    const leadersAwait = await Promise.all(leaders);
    const leadersWithoutNulls = leadersAwait.filter((item) => item.length > 0).flat();

    let trueLeaders = [];
    // Superintendente = 1 || Gerentes = 2 ||
    if (leaderLevelLength === 1) {
      trueLeaders = leadersWithoutNulls.filter((item) => item.hierarchies.level.split('.').length <= leaderLevelLength + 3);
    } else if (leaderLevelLength === 2) {
      trueLeaders = leadersWithoutNulls.filter((item) => item.hierarchies.level.split('.').length <= leaderLevelLength + 2);
    } else {
      trueLeaders = leadersWithoutNulls.filter((item) => item.hierarchies.level.split('.').length <= leaderLevelLength + 1);
    }
    return trueLeaders;
  }
}

module.exports = DepartmentEmployeeController;
