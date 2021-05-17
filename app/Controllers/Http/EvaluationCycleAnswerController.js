/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleAnswer = use('App/Models/EvaluationCycleAnswer');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

const Redis = use('Redis');

class EvaluationCycleAnswerController {
  async index({ request }) {
    const { employeeId, leaderId, evaluation_cycle_id } = request.get();
    const user = await User.find(employeeId);
    const position = await user.positions().fetch();

    if (leaderId !== 'undefined') {
      return EvaluationCycleAnswer.query()
        .where('evaluation_cycle_id', evaluation_cycle_id)
        .where('employee_id', employeeId)
        .with('behaviors', (builder) => {
          builder.with('skills');
        })
        .whereHas('behaviors', (builder) => {
          builder.where('path_id', position.path_id);
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
    }

    return EvaluationCycleAnswer.query()
      .where('evaluation_cycle_id', evaluation_cycle_id)
      .where('employee_id', employeeId)
      .with('behaviors', (builder) => {
        builder.with('skills');
      })
      .whereHas('behaviors', (builder) => {
        builder.where('path_id', position.path_id);
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
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const evaluationCycleAnswer = await EvaluationCycleAnswer.create({ ...data, created_by: auth.user.id });
    const evaluationCycleAnswerReturn = await this.show({ params: { id: evaluationCycleAnswer.id } });
    return response.status(201).json(evaluationCycleAnswerReturn);
  }

  async update({ request, response, auth }) {
    const { data } = request.only('data');

    for (const answer of data) {
      const evaluationCycleAnswer = await EvaluationCycleAnswer.find(answer.id);
      evaluationCycleAnswer.$sideLoaded = { logged_user_id: auth.user.id };
      evaluationCycleAnswer.merge(answer);

      await Redis.del('dashboard-summary');
      await evaluationCycleAnswer.save();
    }

    return response.json({ status: 'ok' });
  }
}

module.exports = EvaluationCycleAnswerController;
