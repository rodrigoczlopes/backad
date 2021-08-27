/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingScheduleSchema extends Schema {
  up() {
    this.create('training_schedules', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('training_id').references('id').inTable('trainings');
      table.date('initial_date');
      table.date('final_date');
      table.string('place');
      table.integer('type');
      table.integer('category');
      table.string('expected_outcome');
      table.uuid('responsible_id').references('id').inTable('users');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('training_schedules');
  }
}

module.exports = TrainingScheduleSchema;
