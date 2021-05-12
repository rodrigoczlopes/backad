/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.table('users', (table) => {
      table.date('password_updated_at');
    });
  }

  down() {
    this.table('users', (table) => {
      table.dropColumn('password_updated_at');
    });
  }
}

module.exports = UserSchema;
