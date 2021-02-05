/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EvaluationCycleSchema extends Schema {
  up() {
    this.table('evaluation_cycles', (table) => {
      table.date('final_manager_evaluation');
      table.date('initial_manager_evaluation');
    });
  }

  down() {
    this.table('evaluation_cycles', (table) => {
      table.dropColumn('final_manager_evaluation');
      table.dropColumn('initial_manager_evaluation');
    });
  }
}

module.exports = EvaluationCycleSchema;
