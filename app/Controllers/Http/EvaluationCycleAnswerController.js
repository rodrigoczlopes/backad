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
        .leftJoin('behaviors', 'behaviors.id', 'evaluation_cycle_answers.behavior_id')
        .select(
          'evaluation_cycle_answers.id',
          'evaluation_cycle_answers.employee_id',
          'evaluation_cycle_answers.leader_id',
          'evaluation_cycle_answers.form_id',
          'evaluation_cycle_answers.evaluation_cycle_id',
          'evaluation_cycle_answers.behavior_id',
          'evaluation_cycle_answers.leader_answer',
          'evaluation_cycle_answers.leader_finished'
        )
        .orderBy('behaviors.description', 'asc')
        .fetch();
      return answers;
    }

    const answer = await EvaluationCycleAnswer.query()
      .where('evaluation_cycle_id', evaluation_cycle_id)
      .where('employee_id', employeeId)
      .with('behaviors', (builder) => {
        builder.with('skills');
      })
      .leftJoin('behaviors', 'behaviors.id', 'evaluation_cycle_answers.behavior_id')
      .select(
        'evaluation_cycle_answers.id',
        'evaluation_cycle_answers.employee_id',
        'evaluation_cycle_answers.leader_id',
        'evaluation_cycle_answers.form_id',
        'evaluation_cycle_answers.evaluation_cycle_id',
        'evaluation_cycle_answers.behavior_id',
        'evaluation_cycle_answers.user_answer',
        'evaluation_cycle_answers.user_finished'
      )
      .orderBy('behaviors.description', 'asc')
      .fetch();

    return answer;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const evaluationCycleAnswer = await EvaluationCycleAnswer.create({ ...data, created_by: auth.user.id });
    const evaluationCycleAnswerReturn = await this.show({ params: { id: evaluationCycleAnswer.id } });
    return response.status(201).json(evaluationCycleAnswerReturn);
  }

  async update({ request, response }) {
    const { data } = request.only('data');

    data.forEach(async (answer) => {
      const evaluationCycleAnswer = await EvaluationCycleAnswer.find(answer.id);
      evaluationCycleAnswer.merge(answer);
      await evaluationCycleAnswer.save();
    });

    return response.json({ status: 'ok' });
  }
}

module.exports = EvaluationCycleAnswerController;