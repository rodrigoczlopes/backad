/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleArea = use('App/Models/EvaluationCycleArea');

class EvaluationCycleAreaController {
  async index() {
    const evaluationCycleAreas = await EvaluationCycleArea.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .fetch();
    return evaluationCycleAreas;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const evaluationCycleArea = await EvaluationCycleArea.create({ ...data, created_by: auth.user.id });
    return response.status(201).json(evaluationCycleArea);
  }

  async show({ params }) {
    const evaluationCycleArea = await EvaluationCycleArea.find(params.id);
    await evaluationCycleArea.loadMany({
      createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']),
    });
    return evaluationCycleArea;
  }

  async update({ params, request, auth }) {
    const data = request.only(['evaluation_cycle_id', 'department_id', 'updated_by']);
    const evaluationCycleArea = await EvaluationCycleArea.find(params.id);
    evaluationCycleArea.merge({ ...data, updated_by: auth.user.id });
    await evaluationCycleArea.save();
    return evaluationCycleArea;
  }

  async destroy({ params }) {
    const evaluationCycleArea = await EvaluationCycleArea.find(params.id);

    await evaluationCycleArea.delete();
  }
}

module.exports = EvaluationCycleAreaController;
