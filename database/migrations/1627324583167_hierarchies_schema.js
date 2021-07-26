/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class HierarchiesSchema extends Schema {
  up() {
    this.table('hierarchies', (table) => {
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('hierarchies', (table) => {
      table.dropColumn('updated_by');
    });
  }
}

module.exports = HierarchiesSchema;
