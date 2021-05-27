/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const DevelopmentPlan = use('App/Models/DevelopmentPlan');

const Redis = use('Redis');

class DevelopmentPlanController {
  async index({ request }) {
    const { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      const cachedDevelopmentPlan = await Redis.get('development-plans');
      if (cachedDevelopmentPlan) {
        return JSON.parse(cachedDevelopmentPlan);
      }

      const allDevelopmentPlans = await DevelopmentPlan.query()
        .with('createdBy', (builder) => {
          builder.select(['id', 'name', 'email', 'avatar']);
        })
        .with('companies')
        .fetch();
      await Redis.set('development-plans', JSON.stringify(allDevelopmentPlans));
      return allDevelopmentPlans;
    }

    if (searchSentence) {
      return DevelopmentPlan.query()
        .where(searchBy, 'like', `%${searchSentence}%`)
        .with('companies')
        .orderBy(searchBy)
        .paginate(page, itemsPerPage);
    }

    return DevelopmentPlan.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .paginate(page, itemsPerPage);
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const developmentPlan = await DevelopmentPlan.create({ ...data, created_by: auth.user.id });
    const developmentPlanReturn = await this.show({ params: { id: developmentPlan.id } });
    await Redis.del('development-plans');
    return response.status(201).json(developmentPlanReturn);
  }

  async show({ params }) {
    const developmentPlan = await DevelopmentPlan.find(params.id);
    await developmentPlan.loadMany({
      createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']),
      companies: null,
    });
    return developmentPlan;
  }

  async update({ params, request, auth }) {
    const data = request.only(['action', 'description', 'company_id', 'active', 'updated_by']);
    const developmentPlan = await DevelopmentPlan.find(params.id);
    developmentPlan.merge({ ...data, updated_by: auth.user.id });
    await developmentPlan.save();
    await Redis.del('development-plans');
    return developmentPlan;
  }

  async destroy({ params }) {
    const developmentPlan = await DevelopmentPlan.find(params.id);

    await developmentPlan.delete();
  }
}

module.exports = DevelopmentPlanController;
