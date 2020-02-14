/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Company = use('App/Models/Company');

/**
 * Resourceful controller for interacting with companies
 */
class UserGroupController {
  async index() {
    const companies = await Company.query()
      .with('createdBy', builder => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .fetch();
    return companies;
  }

  async show({ params }) {
    const company = await Company.find(params.id);
    await company.load('createdBy', builder => {
      builder.select(['id', 'name', 'email', 'avatar']);
    });
    return company;
  }

  async store({ request, response }) {
    const data = request.all();
    const company = await Company.create(data);
    return response.status(201).json(company);
  }

  async update({ params, request }) {
    const data = request.only(['name', 'code']);
    const company = await Company.find(params.id);
    company.merge(data);
    await company.save();
    return company;
  }

  async destroy({ params }) {
    const company = await Company.find(params.id);

    await company.delete();
  }
}

module.exports = UserGroupController;
