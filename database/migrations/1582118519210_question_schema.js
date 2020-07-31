/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class QuestionSchema extends Schema {
  up() {
    this.create('questions', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('company_id').unsigned().references('id').inTable('companies').onDelete('SET NULL').onUpdate('CASCADE');
      table.string('description', 250).notNullable();
      table.uuid('created_by').unsigned().references('id').inTable('users');
      table.uuid('updated_by').unsigned().references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('questions');
  }
}

module.exports = QuestionSchema;
