/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EvaluationCycleAnswerSchema extends Schema {
  up() {
    this.table('evaluation_cycle_answers', (table) => {
      table.boolean('reconciliation_score');
      table.uuid('conciliator_id').references('id').inTable('users');
    });
  }

  down() {
    this.table('evaluation_cycle_answers', (table) => {
      table.dropColumn('reconciliation_score');
      table.dropColumn('conciliator_id').references('id').inTable('users');
    });
  }
}

module.exports = EvaluationCycleAnswerSchema;
