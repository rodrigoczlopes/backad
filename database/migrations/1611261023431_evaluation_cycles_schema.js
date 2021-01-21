/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EvaluationCyclesSchema extends Schema {
  up() {
    this.table('evaluation_cycles', (table) => {
      table.date('final_employee_evaluation');
      table.date('initial_employee_evaluation');
    });
  }

  down() {
    this.table('evaluation_cycles', (table) => {
      table.dropColumn('final_employee_evaluation');
      table.dropColumn('initial_employee_evaluation');
    });
  }
}

module.exports = EvaluationCyclesSchema;
