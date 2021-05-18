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

  async update({ request, response, auth }) {
    const { data } = request.only('data');

    const promises = data?.map(async (justificative) => {
      const evaluationCycleJustificative = await EvaluationCycleJustificative.find(justificative.id);
      evaluationCycleJustificative.$sideLoaded = { logged_user_id: auth.user.id };
      evaluationCycleJustificative.merge(justificative);
      await Redis.del('dashboard-summary');
      return evaluationCycleJustificative.save();
    });

    await Promise.all(promises);

    // for (const justificative of Object.values(data)) {
    //   const evaluationCycleJustificative = await EvaluationCycleJustificative.find(justificative.id);
    //   evaluationCycleJustificative.$sideLoaded = { logged_user_id: auth.user.id };
    //   evaluationCycleJustificative.merge(justificative);
    //   await Redis.del('dashboard-summary');
    //   await evaluationCycleJustificative.save();
    // }

    return response.json({ status: 'ok' });
  }
}

module.exports = EvaluationCycleJustificativeController;
