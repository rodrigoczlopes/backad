/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingRequestSchema extends Schema {
  up() {
    this.create('training_requests', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('leader_id').references('id').inTable('users');
      table.uuid('department_id').references('id').inTable('departments');
      table.integer('type');
      table.integer('category');
      table.string('suggested_institution');
      table.string('expected_outcome');
      table.date('completion_forecast');
      table.integer('human_resources_seem');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('training_requests');
  }
}

module.exports = TrainingRequestSchema;
