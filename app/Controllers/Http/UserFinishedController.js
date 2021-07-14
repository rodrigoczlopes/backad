/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleAnswer = use('App/Models/EvaluationCycleAnswer');

class UserFinishedController {
  async show({ params }) {
    const { evaluation_cycle_id, employee_id } = params;

    return User.query()
      .select(['id', 'name'])
      .where({ id: employee_id })
      .with('evaluationCycleAnswers', (builder) => {
        builder
          .select(['id', 'employee_id', 'evaluation_cycle_id', 'user_finished', 'leader_finished'])
          .where({ evaluation_cycle_id });
      })
      .first();
  }

  async update({ params, response }) {
    try {
      const { employee_id, evaluation_cycle_id } = params;
      const evaluations = await EvaluationCycleAnswer.query().where({ employee_id, evaluation_cycle_id }).fetch();

      evaluations.toJSON().forEach(async (evaluation) => {
        const evaluationToUpdate = await EvaluationCycleAnswer.find(evaluation.id);
        evaluationToUpdate.user_finished = 0;
        evaluationToUpdate.save();
      });

      return response.json({ status: true, message: 'Autoavaliação reaberta com sucesso' });
    } catch (err) {
      return response.status(401).json({ message: err.message });
    }
  }
}

module.exports = UserFinishedController;
