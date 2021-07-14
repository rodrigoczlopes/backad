/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

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
}

module.exports = UserFinishedController;
