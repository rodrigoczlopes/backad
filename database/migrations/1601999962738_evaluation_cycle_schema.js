/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class EvaluationCycleSchema extends Schema {
  up() {
    this.table('evaluation_cycles', (table) => {
      table.datetime('form_sended');
    });
  }

  down() {
    this.table('evaluation_cycles', (table) => {
      table.dropColumn('form_sended');
    });
  }
}

module.exports = EvaluationCycleSchema;
