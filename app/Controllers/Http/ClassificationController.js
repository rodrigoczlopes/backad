/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Classification = use('App/Models/Classification');

class ClassificationController {
  async index() {
    const classification = await Classification.query()
      .with('createdBy', builder => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .fetch();
    return classification;
  }

  async store({ request, response }) {
    const data = request.all();
    const classification = await Classification.create(data);
    return response.status(201).json(classification);
  }

  async show({ params }) {
    const classification = await Classification.find(params.id);
    await classification.loadMany({ createdBy: builder => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return classification;
  }

  async update({ params, request }) {
    const data = request.only(['description', 'initial_value', 'final_value', 'company_id', 'updated_by']);
    const classification = await Classification.find(params.id);
    classification.merge(data);
    await classification.save();
    return classification;
  }

  async destroy({ params }) {
    const classification = await Classification.find(params.id);

    await classification.delete();
  }
}

module.exports = ClassificationController;
