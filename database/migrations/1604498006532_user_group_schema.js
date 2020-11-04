/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserGroupSchema extends Schema {
  up() {
    this.table('user_groups', (table) => {
      table.string('level');
    });
  }

  down() {
    this.table('user_groups', (table) => {
      table.dropColumn('level');
    });
  }
}

module.exports = UserGroupSchema;
