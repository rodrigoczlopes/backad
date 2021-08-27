/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingScheduleEvaluationScoreSchema extends Schema {
  up() {
    this.create('training_schedule_evaluation_scores', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('training_schedule_evaluation_id').references('id').inTable('training_schedule_evaluations');
      table.uuid('training_evaluation_question_id').references('id').inTable('training_evaluation_questions');
      table.string('answer');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('training_schedule_evaluation_scores');
  }
}

module.exports = TrainingScheduleEvaluationScoreSchema;
