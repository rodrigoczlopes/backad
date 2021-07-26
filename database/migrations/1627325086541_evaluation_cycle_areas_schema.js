/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EvaluationCycleAreasSchema extends Schema {
  up() {
    this.table('evaluation_cycle_areas', (table) => {
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('evaluation_cycle_areas', (table) => {
      table.dropColumn('updated_by');
    });
  }
}

module.exports = EvaluationCycleAreasSchema;
