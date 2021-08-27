/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingEvaluationQuestionSchema extends Schema {
  up() {
    this.create('training_evaluation_questions', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.string('question');
      table.integer('type');
      table.uuid('training_evaluation_id').references('id').inTable('training_evaluations');
      table.integer('max_level');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('training_evaluation_questions');
  }
}

module.exports = TrainingEvaluationQuestionSchema;
