/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingScheduleUserSectionVideoLogSchema extends Schema {
  up() {
    this.create('training_schedule_user_section_video_logs', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('employee_id').references('id').inTable('users');
      table.uuid('training_schedule_section_video_id').references('id').inTable('training_schedule_section_videos');
      table.integer('status');
      table.time('watched_time');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('training_schedule_user_section_video_logs');
  }
}

module.exports = TrainingScheduleUserSectionVideoLogSchema;
