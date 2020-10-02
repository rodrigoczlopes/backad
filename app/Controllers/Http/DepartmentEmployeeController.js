/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class DepartmentEmployeeController {
  async show({ params }) {
    const users = await User.query().where('department_id', params.id).where('active', true).fetch();
    return users;
  }
}

module.exports = DepartmentEmployeeController;
