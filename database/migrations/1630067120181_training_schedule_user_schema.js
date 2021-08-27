/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingScheduleUserSchema extends Schema {
  up() {
    this.create('training_schedule_users', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('employee_id').references('id').inTable('users');
      table.uuid('training_schedule_id').references('id').inTable('training_schedules');
      table.integer('status');
      table.string('certificate_url');
      table.date('end_date');
      table.date('removed_at');
      table.decimal('score');
      table.string('observation_about_employee');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('training_schedule_users');
  }
}

module.exports = TrainingScheduleUserSchema;
