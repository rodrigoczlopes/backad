/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class SummaryDepartmentEmployeeController {
  async handle({ params }) {
    const { id } = params;

    return User.query()
      .where({ department_id: id })
      .where({ active: true })
      .with('departments')
      .with('positions', (builder) => {
        builder.with('paths');
      })
      .with('hierarchies')
      .with('evaluationCycleAnswers')
      .withCount('evaluationCycleAnswers', (builder) => {
        builder.orWhere('leader_finished', false).orWhere('leader_finished', null);
      })
      .withCount('evaluationCycleJustificatives', (builder) => {
        builder.orWhere('leader_finished', false).orWhere('leader_finished', null);
      })
      .withCount('evaluationCycleComments', (builder) => {
        builder.orWhere('leader_finished', false).orWhere('leader_finished', null);
      })
      .orderBy('name', 'asc')
      .fetch();
  }
}

module.exports = SummaryDepartmentEmployeeController;
