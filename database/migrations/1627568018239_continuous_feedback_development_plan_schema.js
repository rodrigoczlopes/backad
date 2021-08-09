/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class ContinuousFeedbackDevelopmentPlanSchema extends Schema {
  up() {
    this.create('continuous_feedback_development_plans', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('continuous_feedback_id').references('id').inTable('continuous_feedbacks');
      table.uuid('employee_id').references('id').inTable('users');
      table.uuid('leader_id').references('id').inTable('users');
      table.uuid('development_plan_id').references('id').inTable('development_plans');
      table.string('action');
      table.date('initial_date');
      table.date('final_date');
      table.boolean('leader_finished');
      table.integer('status').defaultTo(0);
      table.string('fake_id');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('continuous_feedback_development_plans');
  }
}

module.exports = ContinuousFeedbackDevelopmentPlanSchema;
