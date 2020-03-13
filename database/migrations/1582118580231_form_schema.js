/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class FormSchema extends Schema {
  up() {
    this.create('forms', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(uuidv4());
      table
        .uuid('company_id')
        .unsigned()
        .references('id')
        .inTable('companies')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table.string('name', 250).notNullable();
      table.string('observation', 250).notNullable();
      table
        .uuid('path_id')
        .unsigned()
        .references('id')
        .inTable('paths')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table.boolean('active');
      table
        .uuid('created_by')
        .unsigned()
        .references('id')
        .inTable('users');
      table
        .uuid('updated_by')
        .unsigned()
        .references('id')
        .inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('forms');
  }
}

module.exports = FormSchema;
