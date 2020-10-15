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
    // TODO:
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

    // Verificando a hierarquia do líder que está acessando
    const hierarchy = await Hierarchy.find(auth.user.hierarchy_id);
    const hierarchyjson = hierarchy.toJSON();
    const employeeLevel = hierarchyjson.level;
    const employeeLevelLength = employeeLevel.split('.').length;

    // Pegando o departamento do líder que está acessando
    const employeeDepartment = await Department.find(auth.user.department_id);
    const employeeDepartmentjson = employeeDepartment.toJSON();
    const employeeDepartmentLevel = employeeDepartmentjson.level;

    // Listando as áreas que fazem parte do fluxo de análise do líder
    const department = await Department.all();
    const departmentjson = department.toJSON();
    const childrenDepartments = departmentjson.filter(
      (dep) =>
        dep.level.split('.').length === employeeLevelLength + 1 &&
        dep.level.split('.')[employeeLevelLength - 1] === employeeDepartmentLevel.split('.')[employeeLevelLength - 1]
    );

    if (childrenDepartments.length === 0) {
      // Pegando todos os colaboradores do setor
      const employees = await User.query()
        .where({ department_id: auth.user.department_id })
        .where('id', '<>', auth.user.id)
        .with('departments')
        .with('positions')
        .with('hierarchies')
        .fetch();
      return employees;
    }

    // Pegando todos os gerente, ou coordenadores, ou lideres dos setores de acordo com o fluxo
    const leaders = childrenDepartments.map(async (children) => {
      const employees = await User.query()
        .where({ department_id: children.id })
        .with('departments')
        .with('positions')
        .with('hierarchies')
        .fetch();
      return employees.toJSON();
    });
    const leadersAwait = await Promise.all(leaders);
    const leadersWithouNulls = leadersAwait.filter((item) => item.length > 0).flat();
    const trueLeaders = leadersWithouNulls.filter((item) => item.hierarchies.level.split('.').length <= employeeLevelLength + 2);

    return trueLeaders;
  }
}

module.exports = DepartmentEmployeeController;
