/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EvaluationCycleLevelsSchema extends Schema {
  up() {
    this.table('evaluation_cycle_levels', (table) => {
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('evaluation_cycle_levels', (table) => {
      table.dropColmumn('updated_by');
    });
  }
}

module.exports = EvaluationCycleLevelsSchema;
