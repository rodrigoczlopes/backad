/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class FormSchema extends Schema {
  up() {
    this.create('forms', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('company_id').references('id').inTable('companies').onDelete('SET NULL').onUpdate('CASCADE');
      table.string('name', 250).notNullable();
      table.string('observation', 250).notNullable();
      table.uuid('path_id').references('id').inTable('paths');
      table.boolean('active');
      table.uuid('created_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('forms');
  }
}

module.exports = FormSchema;
