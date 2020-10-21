/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EvaluationCycleCommentSchema extends Schema {
  up() {
    this.table('evaluation_cycle_comments', (table) => {
      table.uuid('comment_id').unsigned().references('id').inTable('comments').onDelete('SET NULL').onUpdate('CASCADE');
    });
  }

  down() {
    this.table('evaluation_cycle_comments', (table) => {
      table.dropColumn('comment_id');
    });
  }
}

module.exports = EvaluationCycleCommentSchema;
