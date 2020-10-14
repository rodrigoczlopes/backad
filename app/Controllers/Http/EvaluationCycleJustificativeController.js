/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleJustificative = use('App/Models/EvaluationCycleJustificative');

class EvaluationCycleJustificativeController {
  async index({ request }) {
    const { employeeId, leaderId, evaluation_cycle_id } = request.get();

    if (leaderId !== 'undefined') {
      const justificatives = await EvaluationCycleJustificative.query()
        .where('evaluation_cycle_id', evaluation_cycle_id)
        .where('leader_id', leaderId)
        .where('employee_id', employeeId)
        .with('skills')
        .fetch();
      return justificatives;
    }

    const justificative = await EvaluationCycleJustificative.query()
      .where('evaluation_cycle_id', evaluation_cycle_id)
      .where('employee_id', employeeId)
      .with('skills')
      .fetch();

    return justificative;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const evaluationCycleJustificative = await EvaluationCycleJustificative.create({ ...data, created_by: auth.user.id });
    const evaluationCycleJustificativeReturn = await this.show({ params: { id: evaluationCycleJustificative.id } });
    return response.status(201).json(evaluationCycleJustificativeReturn);
  }

  // async show({ params, request, response }) {}

  async update({ request, response }) {
    const { data } = request.only('data');

    data.forEach(async (justificative) => {
      const evaluationCycleJustificative = await EvaluationCycleJustificative.find(justificative.id);
      evaluationCycleJustificative.merge(justificative);
      await evaluationCycleJustificative.save();
    });

    return response.json({ status: 'ok' });
  }

  // async destroy({ params, request, response }) {}
}

module.exports = EvaluationCycleJustificativeController;
