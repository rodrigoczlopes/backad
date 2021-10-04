/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class PdiReportController {
  async handle({ params }) {
    const { id } = params;

    return User.query()
      .select(['id', 'name', 'username', 'registry', 'active', 'department_id', 'company_id', 'position_id', 'hierarchy_id'])
      .where({ active: true })
      .with('departments', (builder) => {
        builder.select(['active', 'id', 'name', 'level']);
      })
      .with('evaluationCycleDevelopmentPlans', (builder) => {
        builder.with('developmentPlans');
      })
      .withCount('evaluationCycleDevelopmentPlans as employeeReceivedPdi', (builder) => {
        builder.where({ evaluation_cycle_id: id });
      })
      .orderBy('name', 'asc')
      .fetch();
  }
}

module.exports = PdiReportController;
