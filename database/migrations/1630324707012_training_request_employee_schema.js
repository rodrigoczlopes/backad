/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingRequestEmployeeSchema extends Schema {
  up() {
    this.create('training_request_employees', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('employee_id').references('id').inTable('users');
      table.uuid('training_request_id').references('id').inTable('training_requests');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('training_request_employees');
  }
}

module.exports = TrainingRequestEmployeeSchema;
