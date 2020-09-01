/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycle = use('App/Models/EvaluationCycle');

class EvaluationCycleController {
  async index() {
    const evaluationCycles = await EvaluationCycle.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with(['companies'])
      .fetch();
    return evaluationCycles;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const evaluationCycle = await EvaluationCycle.create({ ...data, created_by: auth.user.id });
    return response.status(201).json(evaluationCycle);
  }

  async show({ params }) {
    const evaluationCycle = await EvaluationCycle.find(params.id);
    await evaluationCycle.loadMany({
      createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']),
      companies: null,
    });
    return evaluationCycle;
  }

  async update({ params, request, auth }) {
    const data = request.only([
      'description',
      'initial_evaluation_period',
      'finalL_evaluation_period',
      'initial_manager_feedback',
      'final_manager_feedback',
      'complexity_level',
      'justificative',
      'comment',
      'make_report_available',
      'average_type',
      'feedback_type',
      'quantity_pair',
      'quantity_subordinate',
      'quantity_manager',
      'quantity_inferior',
      'quantity_superior',
      'company_id',
      'updated_by',
    ]);
    const evaluationCycle = await EvaluationCycle.find(params.id);
    evaluationCycle.merge({ ...data, updated_by: auth.user.id });
    await evaluationCycle.save();
    return evaluationCycle;
  }

  async destroy({ params }) {
    const evaluationCycle = await EvaluationCycle.find(params.id);

    await evaluationCycle.delete();
  }
}

module.exports = EvaluationCycleController;
