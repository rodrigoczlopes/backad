/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingScheduleSectionAttachmentSchema extends Schema {
  up() {
    this.create('training_schedule_section_attachments', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.string('url');
      table.string('description');
      table.uuid('training_schedule_section_id').references('id').inTable('training_schedule_sections');
      table.decimal('length');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('training_schedule_section_attachments');
  }
}

module.exports = TrainingScheduleSectionAttachmentSchema;
