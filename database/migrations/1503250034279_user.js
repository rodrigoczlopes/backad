/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

const uuidv4 = require('uuid/v4');

class UserSchema extends Schema {
  up() {
    this.create('users', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(uuidv4());
      table
        .uuid('user_group_id')
        .unsigned()
        .references('id')
        .inTable('user_groups')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
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
      table.string('avatar');
      table.bool('active').notNullable();
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
