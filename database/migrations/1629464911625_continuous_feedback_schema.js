/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ContinuousFeedbackSchema extends Schema {
  up() {
    this.table('continuous_feedbacks', (table) => {
      table.datetime('employee_confirmed');
    });
  }

  down() {
    this.table('continuous_feedbacks', (table) => {
      table.dropColumn('employee_confirmed');
    });
  }
}

module.exports = ContinuousFeedbackSchema;
