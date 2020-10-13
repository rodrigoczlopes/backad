/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EvaluationCycleAnswerSchema extends Schema {
  up() {
    this.table('evaluation_cycle_answers', (table) => {
      table.dropColumn('user_justificative');
      table.dropColumn('leader_justificative');
    });
  }

  down() {
    this.table('evaluation_cycle_answers', (table) => {
      table.string('user_justificative');
      table.string('leader_justificative');
    });
  }
}

module.exports = EvaluationCycleAnswerSchema;
