/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EvaluationCycleDevelopmentPlanSchema extends Schema {
  up() {
    this.table('evaluation_cycle_development_plans', (table) => {
      table.string('others');
    });
  }

  down() {
    this.table('evaluation_cycle_development_plans', (table) => {
      table.dropColumn('others');
    });
  }
}

module.exports = EvaluationCycleDevelopmentPlanSchema;
