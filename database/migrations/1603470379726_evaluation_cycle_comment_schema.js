/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EvaluationCycleCommentSchema extends Schema {
  up() {
    this.table('evaluation_cycle_comments', (table) => {
      table.boolean('leader_finished');
    });
  }

  down() {
    this.table('evaluation_cycle_comments', (table) => {
      table.dropColumn('leader_finished');
    });
  }
}

module.exports = EvaluationCycleCommentSchema;
