/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Department = use('App/Models/Department');

const Redis = use('Redis');

class DepartmentController {
  async index({ request }) {
    const { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      const cachedDepartments = await Redis.get('departments');

      if (cachedDepartments) {
        return JSON.parse(cachedDepartments);
      }

      const departments = await Department.query()
        .with('createdBy', (builder) => {
          builder.select(['id', 'name', 'email', 'avatar']);
        })
        .with('companies', (builder) => {
          builder.select(['id', 'name']);
        })
        .withCount('users', (builder) => builder.where({ active: true }))
        .orderBy('level')
        .fetch();

      await Redis.set('departments', JSON.stringify(departments));
      return departments;
    }

    if (searchSentence) {
      return Department.query()
        .where(searchBy, 'like', `%${searchSentence}%`)
        .with('companies')
        .orderBy(searchBy)
        .paginate(page, itemsPerPage);
    }

    return Department.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .orderBy('level')
      .paginate(page, itemsPerPage);
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const department = await Department.create({ ...data, created_by: auth.user.id });
    const departmentReturn = await this.show({ params: { id: department.id } });
    await Redis.del('departments');
    return response.status(201).json(departmentReturn);
  }

  async show({ params }) {
    const department = await Department.findOrFail(params.id);
    await department.loadMany({ createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return department;
  }

  async update({ params, request, auth }) {
    const data = request.only(['name', 'level', 'area_code', 'company_id', 'active', 'updated_by', 'leader_id']);
    const department = await Department.find(params.id);
    department.merge({ ...data, updated_by: auth.user.id });
    await department.save();
    await Redis.del('departments');
    return department;
  }

  async destroy({ params }) {
    const department = await Department.find(params.id);
    await Redis.del('departments');
    await department.delete();
  }
}

module.exports = DepartmentController;
