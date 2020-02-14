/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

const uuidv4 = require('uuid/v4');

class PositionSchema extends Schema {
  up() {
    this.create('positions', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(uuidv4());
      table
        .uuid('path_id')
        .unsigned()
        .references('id')
        .inTable('paths')
        .notNullable();
      table
        .uuid('company_id')
        .unsigned()
        .references('id')
        .inTable('companies')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table.string('description', 250).notNullable();
      table.integer('position_code').notNullable();
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
    this.drop('positions');
  }
}

module.exports = PositionSchema;
