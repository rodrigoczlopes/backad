/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class SummaryEmployeeController {
  async show({ params }) {
    const { evaluation_cycle_id, employee_id } = params;

    const employees = await User.query()
      .where({ id: employee_id })
      .where({ active: true })
      .with('departments')
      .with('positions', (builder) => {
        builder.with('paths');
      })
      .with('hierarchies')
      .with('evaluationCycleAnswers', (builder) => {
        builder.where({ evaluation_cycle_id }).with('behaviors', (childBuilder) => {
          childBuilder.with('skills');
        });
      })
      .with('evaluationCycleJustificatives', (builder) => {
        builder.where({ evaluation_cycle_id }).with('skills');
      })
      .with('evaluationCycleComments', (builder) => {
        builder.where({ evaluation_cycle_id }).with('comments');
      })
      .orderBy('name', 'asc')
      .fetch();
    return employees.first();
  }
}

module.exports = SummaryEmployeeController;
