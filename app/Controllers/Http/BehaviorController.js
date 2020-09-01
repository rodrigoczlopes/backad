/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Behavior = use('App/Models/Behavior');

class BehaviorController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }
    const behaviors = await Behavior.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .with('paths')
      .with('skills')
      .orderBy('description')
      .paginate(page, itemsPerPage);
    return behaviors;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const behavior = await Behavior.create({ ...data, created_by: auth.user.id });
    const behaviorReturn = await this.show({ params: { id: behavior.id } });
    return response.status(201).json(behaviorReturn);
  }

  async show({ params }) {
    const behavior = await Behavior.find(params.id);
    await behavior.loadMany({
      createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']),
      companies: null,
      paths: null,
      skills: null,
    });
    return behavior;
  }

  async update({ params, request, auth }) {
    const data = request.only(['description', 'path_id', 'skill_id', 'company_id', 'active', 'updated_by']);
    const behavior = await Behavior.find(params.id);
    behavior.merge({ ...data, updated_by: auth.user.id });
    await behavior.save();
    return behavior;
  }

  async destroy({ params }) {
    const behavior = await Behavior.find(params.id);
    await behavior.delete();
  }
}

module.exports = BehaviorController;
