/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class DepartmentNewColumnLeaderSchema extends Schema {
  up() {
    this.table('departments', (table) => {
      table.uuid('leader_id').references('id').inTable('users');
    });
  }

  down() {
    this.table('departments', (table) => {
      // reverse alternations
      table.dropColumn('leader_id');
    });
  }
}

module.exports = DepartmentNewColumnLeaderSchema;
