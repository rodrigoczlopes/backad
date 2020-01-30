/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

const uuidv4 = require('uuid/v4');

class PathSchema extends Schema {
  up() {
    this.create('paths', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(uuidv4());
      table.string('description', 250);
      table
        .uuid('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
      table
        .uuid('updated_by')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
      table.timestamps();
    });
  }

  down() {
    this.drop('paths');
  }
}

module.exports = PathSchema;
