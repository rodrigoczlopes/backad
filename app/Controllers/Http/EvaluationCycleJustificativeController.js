/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleJustificative = use('App/Models/EvaluationCycleJustificative');
const Redis = use('Redis');

class EvaluationCycleJustificativeController {
  async index({ request }) {
    const { employeeId, leaderId, evaluation_cycle_id } = request.get();

    if (leaderId !== 'undefined') {
      return EvaluationCycleJustificative.query()
        .where('evaluation_cycle_id', evaluation_cycle_id)
        .where('employee_id', employeeId)
        .with('skills')
        .select(
          'id',
          'employee_id',
          'leader_id',
          'form_id',
          'evaluation_cycle_id',
          'skill_id',
          'leader_justificative',
          'leader_finished'
        )
        .fetch();
    }

    return EvaluationCycleJustificative.query()
      .where('evaluation_cycle_id', evaluation_cycle_id)
      .where('employee_id', employeeId)
      .with('skills')
      .select(
        'id',
        'employee_id',
        'leader_id',
        'form_id',
        'evaluation_cycle_id',
        'skill_id',
        'user_justificative',
        'user_finished'
      )
      .fetch();
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

    data?.forEach(async (justificative) => {
      const evaluationCycleJustificative = await EvaluationCycleJustificative.find(justificative.id);
      evaluationCycleJustificative.merge(justificative);
      await Redis.del('dashboard-summary');
      await evaluationCycleJustificative.save();
    });

    return response.json({ status: 'ok' });
  }

  // async destroy({ params, request, response }) {}
}

module.exports = EvaluationCycleJustificativeController;
