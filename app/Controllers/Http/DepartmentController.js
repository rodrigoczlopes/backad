/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Department = use('App/Models/Department');

class DepartmentController {
  async index({ request, response, view }) {
    const departments = await Department.query()
      .with('createdBy', builder => {
        builder.select(['id', 'name', 'email', 'avatar']);
      }).with()
      .fetch();
    return departments;
  }

  async store({ request, response }) {
    const data = request.all();
    const department = await Department.create(data);
    return response.status(201).json(department);
  }

  async show({ params, request, response, view }) {}

  async update({ params, request, response }) {}

  async destroy({ params, request, response }) {}
}

module.exports = DepartmentController;
