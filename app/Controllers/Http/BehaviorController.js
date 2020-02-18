/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Behavior = use('App/Models/Behavior');

class BehaviorController {
  async index() {
    const behaviors = await Behavior.query()
      .with('createdBy', builder => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .fetch();
    return behaviors;
  }

  async store({ request, response }) {
    const data = request.all();
    const behavior = await Behavior.create(data);
    return response.status(201).json(behavior);
  }

  async show({ params }) {
    const behavior = await Behavior.find(params.id);
    await behavior.loadMany({ createdBy: builder => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return behavior;
  }

  async update({ params, request }) {
    const data = request.only(['description', 'path_id', 'skill_id', 'company_id', 'active']);
    const behavior = await Behavior.find(params.id);
    behavior.merge(data);
    await behavior.save();
    return behavior;
  }

  async destroy({ params }) {
    const behavior = await Behavior.find(params.id);
    await behavior.delete();
  }
}

module.exports = BehaviorController;
