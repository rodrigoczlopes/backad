/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingScheduleSectionSchema extends Schema {
  up() {
    this.create('training_schedule_sections', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.string('description');
      table.integer('status');
      table.integer('type');
      table.date('initial_date');
      table.date('final_date');
      table.time('workload');
      table.uuid('training_schedule_id').references('id').inTable('training_schedules');
      table.uuid('training_instructor_id').references('id').inTable('training_instructors');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('training_schedule_sections');
  }
}

module.exports = TrainingScheduleSectionSchema;
