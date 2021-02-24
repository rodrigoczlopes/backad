/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EvaluationCycleDevelopmentPlanSchema extends Schema {
  up() {
    this.table('evaluation_cycle_development_plans', (table) => {
      table.dropColumn('fakeId');
      table.string('fake_id');
    });
  }

  down() {
    this.table('evaluation_cycle_development_plans', (table) => {
      table.string('fakeId');
      table.dropColumn('fake_id');
    });
  }
}

module.exports = EvaluationCycleDevelopmentPlanSchema;
