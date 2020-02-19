/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const DevelopmentPlan = use('App/Models/DevelopmentPlan');

class DevelopmentPlanController {
  async index() {
    const developmentPlans = await DevelopmentPlan.query()
      .with('createdBy', builder => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .fetch();
    return developmentPlans;
  }

  async store({ request, response }) {
    const data = request.all();
    const developmentPlan = await DevelopmentPlan.create(data);
    return response.status(201).json(developmentPlan);
  }

  async show({ params }) {
    const developmentPlan = await DevelopmentPlan.find(params.id);
    await developmentPlan.loadMany({ createdBy: builder => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return developmentPlan;
  }

  async update({ params, request }) {
    const data = request.only(['action', 'description', 'company_id', 'active']);
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
