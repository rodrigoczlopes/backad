/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Company = use('App/Models/Company');

const Redis = use('Redis');

/**
 * Resourceful controller for interacting with companies
 */
class CompanyController {
  async index() {
    const cachedCompany = await Redis.get('companies');

    if (cachedCompany) {
      return JSON.parse(cachedCompany);
    }

    const companies = await Company.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .fetch();

    await Redis.set('companies', JSON.stringify(companies));
    return companies;
  }

  async show({ params }) {
    const company = await Company.find(params.id);
    await company.load('createdBy', (builder) => {
      builder.select(['id', 'name', 'email', 'avatar']);
    });
    return company;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const company = await Company.create({ ...data, created_by: auth.user.id });
    await Redis.del('companies');
    return response.status(201).json(company);
  }

  async update({ params, request, auth }) {
    const data = request.only(['name', 'code', 'updated_by']);
    const company = await Company.find(params.id);
    company.merge({ ...data, updated_by: auth.user.id });
    await company.save();
    await Redis.del('companies');
    return company;
  }

  async destroy({ params }) {
    const company = await Company.find(params.id);
    await company.delete();
    await Redis.del('companies');
  }
}

module.exports = CompanyController;
