/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ClassificationsSchema extends Schema {
  up() {
    this.table('classifications', (table) => {
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('classifications', (table) => {
      table.dropColumn('updated_by');
    });
  }
}

module.exports = ClassificationsSchema;
