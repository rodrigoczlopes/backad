/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EvaluationCycleAnswerSchema extends Schema {
  up() {
    this.table('evaluation_cycle_answers', (table) => {
      table.date('employee_response_date');
      table.date('leader_response_date');
      table.date('calibration_date');
    });
  }

  down() {
    this.table('evaluation_cycle_answers', (table) => {
      table.dropColumn('employee_response_date');
      table.dropColumn('leader_response_date');
      table.dropColumn('calibration_date');
    });
  }
}

module.exports = EvaluationCycleAnswerSchema;
