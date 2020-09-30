/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Department = use('App/Models/Department');

class DepartmentController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }

    if (searchSentence) {
      const ratingScales = await Department.query()
        .where(searchBy, 'ilike', `%${searchSentence}%`)
        .with('companies')
        .orderBy(searchBy)
        .paginate(page, itemsPerPage);
      return ratingScales;
    }

    const departments = await Department.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .orderBy('level')
      .paginate(page, itemsPerPage);

    return departments;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const department = await Department.create({ ...data, created_by: auth.user.id });
    const departmentReturn = await this.show({ params: { id: department.id } });
    return response.status(201).json(departmentReturn);
  }

  async show({ params }) {
    const department = await Department.findOrFail(params.id);
    await department.loadMany({ createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return department;
  }

  async update({ params, request, auth }) {
    const data = request.only(['name', 'level', 'area_code', 'company_id', 'active', 'updated_by']);
    const department = await Department.find(params.id);
    department.merge({ ...data, updated_by: auth.user.id });
    await department.save();
    return department;
  }

  async destroy({ params }) {
    const department = await Department.find(params.id);

    await department.delete();
  }
}

module.exports = DepartmentController;
