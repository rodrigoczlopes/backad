/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingEvaluationSchema extends Schema {
  up() {
    this.create('training_evaluations', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.string('description');
      table.uuid('training_id').references('id').inTable('trainings');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('training_evaluations');
  }
}

module.exports = TrainingEvaluationSchema;
