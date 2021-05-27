/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EvaluationCycleCommentSchema extends Schema {
  up() {
    this.table('evaluation_cycle_comments', (table) => {
      table.date('employee_receipt_confirmation_date');
      table.date('leader_feedback_submission_date');
    });
  }

  down() {
    this.table('evaluation_cycle_comments', (table) => {
      table.dropColumn('employee_receipt_confirmation_date');
      table.dropColumn('leader_feedback_submission_date');
    });
  }
}

module.exports = EvaluationCycleCommentSchema;
