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
      .select(['id', 'name', 'username', 'registry', 'active', 'department_id', 'company_id', 'position_id', 'hierarchy_id'])
      .where({ active: true })
      .with('departments', (builder) => {
        builder.select(['active', 'id', 'name', 'level']);
      })
      .withCount('evaluationCycleAnswers as employeeEvaluationAnswers', (builder) => {
        builder.whereRaw('(user_finished = 0 or user_finished is null)');
      })
      .withCount('evaluationCycleJustificatives as employeeEvaluationJustificatives', (builder) => {
        builder.whereRaw('(user_finished = 0 or user_finished is null)');
      })
      .withCount('evaluationCycleAnswers as leaderEvaluationAnswers', (builder) => {
        builder.whereRaw('(leader_finished = 0 or leader_finished is null)');
      })
      .withCount('evaluationCycleJustificatives as leaderEvaluationJustificatives', (builder) => {
        builder.whereRaw('(leader_finished = 0 or leader_finished is null)');
      })
      .withCount('evaluationCycleComments as leaderEvaluationComments', (builder) => {
        builder.whereRaw('(leader_finished = 0 or leader_finished is null)');
      })
      .withCount('evaluationCycleComments as employeeConfirmFeedback', (builder) => {
        builder.whereRaw('employee_receipt_confirmation_date is null');
      })
      .orderBy('name', 'asc')
      .fetch();

    await Redis.set('dashboard-summary', JSON.stringify(employees));
    return employees;
  }
}

module.exports = DashboardSummary;
