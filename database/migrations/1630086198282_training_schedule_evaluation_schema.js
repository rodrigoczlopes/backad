/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingScheduleEvaluationSchema extends Schema {
  up() {
    this.create('training_schedule_evaluations', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('training_schedule_id').references('id').inTable('training_schedules');
      table.uuid('employee_id').references('id').inTable('users');
      table.uuid('training_evaluation_id').references('id').inTable('training_evaluations');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('training_schedule_evaluations');
  }
}

module.exports = TrainingScheduleEvaluationSchema;
