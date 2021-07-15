/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class ContinuousFeedbackSchema extends Schema {
  up() {
    this.create('continuous_feedbacks', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('company_id').references('id').inTable('companies').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('employee_id').references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE');
      table.integer('category');
      table.string('description');
      table.boolean('visible_to_employee');
      table.string('insignia');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('continuous_feedbacks');
  }
}

module.exports = ContinuousFeedbackSchema;
