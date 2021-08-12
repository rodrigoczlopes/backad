/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleLevel = use('App/Models/EvaluationCycleLevel');

class EvaluationCycleLevelController {
  async index() {
    const evaluationCycleLevels = await EvaluationCycleLevel.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .fetch();
    return evaluationCycleLevels;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const evaluationCycleLevel = await EvaluationCycleLevel.create({ ...data, created_by: auth.user.id });
    return response.status(201).json(evaluationCycleLevel);
  }

  async show({ params }) {
    const evaluationCycleLevel = await EvaluationCycleLevel.find(params.id);
    console.log(params);
    await evaluationCycleLevel.loadMany({
      createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']),
    });
    return evaluationCycleLevel;
  }

  async update({ params, request, auth }) {
    const data = request.only(['evaluation_cycle_id', 'hierarchy_id', 'updated_by']);
    const evaluationCycleLevel = await EvaluationCycleLevel.find(params.id);
    evaluationCycleLevel.merge({ ...data, updated_by: auth.user.id });
    await evaluationCycleLevel.save();
    return evaluationCycleLevel;
  }

  async destroy({ params }) {
    const evaluationCycleLevel = await EvaluationCycleLevel.find(params.id);

    await evaluationCycleLevel.delete();
  }
}

module.exports = EvaluationCycleLevelController;
