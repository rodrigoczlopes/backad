/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class PositionsSchema extends Schema {
  up() {
    this.table('positions', (table) => {
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('positions', (table) => {
      table.dropColumn('updated_by');
    });
  }
}

module.exports = PositionsSchema;
