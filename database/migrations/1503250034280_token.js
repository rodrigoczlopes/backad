/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

const { v4: uuidv4 } = require('uuid');

class TokensSchema extends Schema {
  up() {
    this.create('tokens', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(uuidv4());
      table
        .uuid('user_id')
        .unsigned()
        .references('id')
        .inTable('users');
      table
        .string('token', 255)
        .notNullable()
        .unique()
        .index();
      table.string('type', 80).notNullable();
      table.boolean('is_revoked').defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('tokens');
  }
}

module.exports = TokensSchema;
