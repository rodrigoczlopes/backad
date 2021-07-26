/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserGroupsSchema extends Schema {
  up() {
    this.table('user_groups', (table) => {
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('user_groups', (table) => {
      table.dropColumn('updated_by');
    });
  }
}

module.exports = UserGroupsSchema;
