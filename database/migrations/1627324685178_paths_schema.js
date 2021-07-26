/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class PathsSchema extends Schema {
  up() {
    this.table('paths', (table) => {
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('paths', (table) => {
      table.dropColumn('updated_by');
    });
  }
}

module.exports = PathsSchema;
