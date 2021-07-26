/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class FormsSchema extends Schema {
  up() {
    this.table('forms', (table) => {
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('forms', (table) => {
      table.dropColmumn('updated_by');
    });
  }
}

module.exports = FormsSchema;
