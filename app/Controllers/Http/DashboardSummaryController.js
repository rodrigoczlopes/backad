/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class DashboardSummary {
  async index() {
    const employees = await User.query()
      .where({ active: true })
      .with('departments')
      .withCount('evaluationCycleAnswers as employeeEvaluationAnswers', (builder) => {
        builder.orWhere({ user_finished: false }).orWhere({ user_finished: null });
      })
      .withCount('evaluationCycleJustificatives as employeeEvaluationJustificatives', (builder) => {
        builder.orWhere({ user_finished: false }).orWhere({ user_finished: null });
      })
      .withCount('evaluationCycleAnswers as leaderEvaluationAnswers', (builder) => {
        builder.orWhere({ leader_finished: false }).orWhere({ leader_finished: null });
      })
      .withCount('evaluationCycleJustificatives as leaderEvaluationJustificatives', (builder) => {
        builder.orWhere({ leader_finished: false }).orWhere({ leader_finished: null });
      })
      .withCount('evaluationCycleComments as leaderEvaluationComments', (builder) => {
        builder.orWhere({ leader_finished: false }).orWhere({ leader_finished: null });
      })
      .orderBy('name', 'asc')
      .fetch();
    return employees;
  }
}

module.exports = DashboardSummary;
