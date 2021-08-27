/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingScheduleCostSchema extends Schema {
  up() {
    this.create('training_schedule_costs', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.integer('type');
      table.integer('category');
      table.string('string');
      table.decimal('amount');
      table.boolean('accomplished');
      table.uuid('training_schedule_id').references('id').inTable('training_schedules');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('training_schedule_costs');
  }
}

module.exports = TrainingScheduleCostSchema;
