/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Department = use('App/Models/Department');

class DepartmentController {
  async index() {
    const departments = await Department.query()
      .with('createdBy', builder => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .fetch();
    return departments;
  }

  async store({ request, response }) {
    const data = request.all();
    const department = await Department.create(data);
    return response.status(201).json(department);
  }

  async show({ params }) {
    const department = await Department.find(params.id);
    await department.loadMany({ createdBy: builder => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return department;
  }

  async update({ params, request }) {
    const data = request.only(['name', 'level', 'area_code', 'company_id', 'active']);
    const department = await Department.find(params.id);
    department.merge(data);
    await department.save();
    return department;
  }

  async destroy({ params }) {
    const department = await Department.find(params.id);

    await department.delete();
  }
}

module.exports = DepartmentController;
