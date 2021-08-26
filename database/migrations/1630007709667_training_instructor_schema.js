/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingInstructorSchema extends Schema {
  up() {
    this.create('training_instructors', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.string('name');
      table.string('signature_url');
      table.string('description');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('training_instructors');
  }
}

module.exports = TrainingInstructorSchema;
