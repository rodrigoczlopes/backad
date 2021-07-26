/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class QuestionsSchema extends Schema {
  up() {
    this.table('questions', (table) => {
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('questions', (table) => {
      table.dropColumn('updated_by');
    });
  }
}

module.exports = QuestionsSchema;
