/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.create('users', table => {
      table.increments();
      table.string('registry', 20).notNullable();
      table
        .string('username', 80)
        .notNullable()
        .unique();
      table.string('name', 80).notNullable();
      table.string('email', 254).notNullable();
      table.string('password', 60).notNullable();
      table
        .string('cpf', 15)
        .notNullable()
        .unique();
      table.bool('active');
      table.date('admitted_at').notNullable();
      table.date('fired_at');
      table.date('deleted_at');
      table.timestamps();
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
