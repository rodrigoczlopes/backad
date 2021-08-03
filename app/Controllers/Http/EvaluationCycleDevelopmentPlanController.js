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
    try {
      if (params.id.length <= 20) {
        const classificationFakeId = await EvaluationCycleDevelopmentPlan.findBy('fake_id', params.id);
        if (classificationFakeId) {
          await classificationFakeId.delete();
          return response.status(204).json({ message: 'Item deletado com sucesso' });
        }
        return response.status(204).json({ message: 'Item temporário excluído com sucesso' });
      }

      const classification = await EvaluationCycleDevelopmentPlan.find(params.id);
      await classification.delete();
      return response.status(204).json({ message: 'Item deletado com sucesso' });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  }
}

module.exports = EvaluationCycleDevelopmentPlanController;
