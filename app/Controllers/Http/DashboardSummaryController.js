/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

const Redis = use('Redis');

class DashboardSummary {
  async index() {
    const cachedSummary = await Redis.get('dashboard-summary');
    if (cachedSummary) {
      return JSON.parse(cachedSummary);
    }

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

    await Redis.set('dashboard-summary', JSON.stringify(employees));
    return employees;
  }
}

module.exports = DashboardSummary;
