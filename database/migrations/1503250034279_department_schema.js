/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const uuidv4 = require('uuid/v4');

class DepartmentSchema extends Schema {
  up() {
    this.create('departments', table => {
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
      table.string('level', 80);
      table.integer('area_code');
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
    this.drop('departments');
  }
}

module.exports = DepartmentSchema;
