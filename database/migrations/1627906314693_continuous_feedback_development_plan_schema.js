/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ContinuousFeedbackDevelopmentPlanSchema extends Schema {
  up() {
    this.table('continuous_feedback_development_plans', (table) => {
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('continuous_feedback_development_plans', (table) => {
      table.dropColumn('created_by');
      table.dropColumn('updated_by');
    });
  }
}

module.exports = ContinuousFeedbackDevelopmentPlanSchema;
