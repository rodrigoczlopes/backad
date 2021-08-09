/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class EvaluationCycleAnswerSchema extends Schema {
  up() {
    this.create('evaluation_cycle_answers', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('employee_id').references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('leader_id').references('id').inTable('users');
      table.uuid('form_id').references('id').inTable('forms');
      table.uuid('evaluation_cycle_id').references('id').inTable('evaluation_cycles');
      table.uuid('behavior_id').references('id').inTable('behaviors');
      table.decimal('user_answer');
      table.string('user_justificative');
      table.boolean('user_finished');
      table.decimal('leader_answer');
      table.string('leader_justificative');
      table.boolean('leader_finished');
      table.boolean('reconciliation_score');
      table.uuid('conciliator_id').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('evaluation_cycle_answers');
  }
}

module.exports = EvaluationCycleAnswerSchema;
