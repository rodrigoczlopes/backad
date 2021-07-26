/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EvaluationCyclesSchema extends Schema {
  up() {
    this.table('evaluation_cycles', (table) => {
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('evaluation_cycles', (table) => {
      table.dropColumn('updated_by');
    });
  }
}

module.exports = EvaluationCyclesSchema;
