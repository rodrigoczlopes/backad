/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycle = use('App/Models/EvaluationCycle');

class EvaluationCycleController {
  async index() {
    const evaluationCycles = await EvaluationCycle.query()
      .with('createdBy', builder => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with(['companies'])
      .fetch();
    return evaluationCycles;
  }

  async store({ request, response }) {
    const data = request.all();
    const evaluationCycle = await EvaluationCycle.create(data);
    return response.status(201).json(evaluationCycle);
  }

  async show({ params }) {
    const evaluationCycle = await EvaluationCycle.find(params.id);
    await evaluationCycle.loadMany({ createdBy: builder => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return evaluationCycle;
  }

  async update({ params, request }) {
    const data = request.only(['action', 'description', 'company_id', 'active']);
    const evaluationCycle = await EvaluationCycle.find(params.id);
    evaluationCycle.merge(data);
    await evaluationCycle.save();
    return evaluationCycle;
  }

  async destroy({ params }) {
    const evaluationCycle = await EvaluationCycle.find(params.id);

    await evaluationCycle.delete();
  }
}

module.exports = EvaluationCycleController;
