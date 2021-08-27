/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingTestimonialSchema extends Schema {
  up() {
    this.create('training_testimonials', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('training_instructor_id').references('id').inTable('training_instructors');
      table.string('title');
      table.string('description');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('training_testimonials');
  }
}

module.exports = TrainingTestimonialSchema;
