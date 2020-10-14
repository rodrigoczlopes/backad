/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Department = use('App/Models/Department');

class DepartmentEmployeeController {
  async index({ auth }) {
    // Identificar a hierarquia do lider
    // Verificar as áreas que estão imediatamente sob essa hierarquia ou seja tenha o tamanho do array do split com ponto + 1
    // Pegar os usuários desses setores que fazem parte dessa hierarquia
    // exemplo: 01 -> 01.01 (todos gerentes)
    // exemplo: 01.01 -> 01.01.01 (todos coordenadores)
    // exemplo: 01.01.01 -> 01.01.01.01(todos lideres)
    // exemplo: 01.01.01.01 -> 01.01.01.01 (todos lideres tecnicos)
    // esses acima vão avaliar, e serão avaliados

    const department = await Department.findBy({ leader_id: auth.user.id });
    const departmentjson = department.toJSON();

    const users = await User.query().where({ department_id: departmentjson.id }).fetch();
    return users;
    // let items = [];
    // users.toJSON().forEach((user) => {
    //   items = [
    //     ...items,
    //     {
    //       id: user.id,
    //       name: user.name,
    //       department_id: user.department_id,
    //       position_id: user.position_id,
    //       departments: user.departments,
    //     },
    //   ];
    // });
    // return items;
  }
}

module.exports = DepartmentEmployeeController;
