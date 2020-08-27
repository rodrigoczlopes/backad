/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const DevelopmentPlan = use('App/Models/DevelopmentPlan');

class DevelopmentPlanController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }

    if (searchSentence) {
      const ratingScales = await DevelopmentPlan.query()
        .where(searchBy, 'ilike', `%${searchSentence}%`)
        .with('companies')
        .orderBy(searchBy)
        .paginate(page, itemsPerPage);
      return ratingScales;
    }

    const developmentPlans = await DevelopmentPlan.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .paginate(page, itemsPerPage);
    return developmentPlans;
  }

  async store({ request, response }) {
    const data = request.all();
    const developmentPlan = await DevelopmentPlan.create(data);
    const developmentPlanReturn = await this.show({ params: { id: developmentPlan.id } });
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

  async update({ params, request }) {
    const data = request.only(['action', 'description', 'company_id', 'active', 'updated_by']);
    const developmentPlan = await DevelopmentPlan.find(params.id);
    developmentPlan.merge(data);
    await developmentPlan.save();
    return developmentPlan;
  }

  async destroy({ params }) {
    const developmentPlan = await DevelopmentPlan.find(params.id);

    await developmentPlan.delete();
  }
}

module.exports = DevelopmentPlanController;
