/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingScheduleSectionVideoSchema extends Schema {
  up() {
    this.create('training_schedule_section_videos', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.string('url');
      table.time('duration');
      table.string('description');
      table.integer('sequence');
      table.uuid('training_schedule_section_id').references('id').inTable('training_schedule_sections');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('training_schedule_section_videos');
  }
}

module.exports = TrainingScheduleSectionVideoSchema;
