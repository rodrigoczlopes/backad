/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleAnswer = use('App/Models/EvaluationCycleAnswer');

class EvaluationCycleAnswerController {
  async index({ request }) {
    const { employeeId, leaderId, evaluation_cycle_id } = request.get();

    if (leaderId !== 'undefined') {
      const answers = await EvaluationCycleAnswer.query()
        .where('evaluation_cycle_id', evaluation_cycle_id)
        .where('employee_id', employeeId)
        .with('behaviors', (builder) => {
          builder.with('skills');
        })
        .select(
          'id',
          'employee_id',
          'leader_id',
          'form_id',
          'evaluation_cycle_id',
          'behavior_id',
          'leader_answer',
          'leader_finished'
        )
        .fetch();
      return answers;
    }

    const answer = await EvaluationCycleAnswer.query()
      .where('evaluation_cycle_id', evaluation_cycle_id)
      .where('employee_id', employeeId)
      .with('behaviors', (builder) => {
        builder.with('skills');
      })
      .select('id', 'employee_id', 'leader_id', 'form_id', 'evaluation_cycle_id', 'behavior_id', 'user_answer', 'user_finished')
      .fetch();

    return answer;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const evaluationCycleAnswer = await EvaluationCycleAnswer.create({ ...data, created_by: auth.user.id });
    const evaluationCycleAnswerReturn = await this.show({ params: { id: evaluationCycleAnswer.id } });
    return response.status(201).json(evaluationCycleAnswerReturn);
  }

  // async show({ params, request, response }) {}

  async update({ request, response }) {
    const { data } = request.only('data');

    data.forEach(async (answer) => {
      const evaluationCycleAnswer = await EvaluationCycleAnswer.find(answer.id);
      evaluationCycleAnswer.merge(answer);
      await evaluationCycleAnswer.save();
    });

    return response.json({ status: 'ok' });
  }

  // async destroy({ params, request, response }) {}
}

module.exports = EvaluationCycleAnswerController;
