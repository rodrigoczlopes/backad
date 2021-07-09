/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleDevelopmentPlan = use('App/Models/EvaluationCycleDevelopmentPlan');

class EvaluationCycleDevelopmentPlanController {
  async index({ request }) {
    const { evaluation_cycle_id, employee_id } = request.all();
    return EvaluationCycleDevelopmentPlan.query()
      .where({ employee_id })
      .where({ evaluation_cycle_id })
      .with('developmentPlans')
      .fetch();
  }

  async store({ request, response }) {
    const data = request.all();
    const evaluationCycleDevelopmentPlan = await EvaluationCycleDevelopmentPlan.create({ ...data });

    return response.status(201).json(evaluationCycleDevelopmentPlan);
  }

  async update({ request, response }) {
    const { data } = request.only('data');

    data.forEach(async (developmentPlan) => {
      const evaluationCycleDevelopmentPlan = await EvaluationCycleDevelopmentPlan.find(developmentPlan.id);
      evaluationCycleDevelopmentPlan.merge(developmentPlan);
      await evaluationCycleDevelopmentPlan.save();
    });

    return response.json({ status: 'ok' });
  }

  async destroy({ params, response }) {
    let classification = await EvaluationCycleDevelopmentPlan.find(params.id);
    if (!classification) {
      classification = await EvaluationCycleDevelopmentPlan.findBy('fake_id', params.id);
    }
    if (classification) {
      await classification.delete();
    } else {
      return response.status(204).json({ message: 'Não foi encontrado item para ser excluido na base' });
    }
  }
}

module.exports = EvaluationCycleDevelopmentPlanController;
