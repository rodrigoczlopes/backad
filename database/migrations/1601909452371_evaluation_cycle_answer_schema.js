/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class EvaluationCycleAnswerSchema extends Schema {
  up() {
    this.create('evaluation_cycle_answers', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('employee_id').unsigned().references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('leader_id').unsigned().references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('form_id').unsigned().references('id').inTable('forms').onDelete('SET NULL').onUpdate('CASCADE');
      table
        .uuid('evaluation_cycle_id')
        .unsigned()
        .references('id')
        .inTable('evaluation_cycles')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table.uuid('behavior_id').unsigned().references('id').inTable('behaviors').onDelete('SET NULL').onUpdate('CASCADE');
      table.integer('user_answer');
      table.string('user_justificative');
      table.boolean('user_finished');
      table.integer('leader_answer');
      table.string('leader_justificative');
      table.boolean('leader_finished');
      table.timestamps();
    });
  }

  down() {
    this.drop('evaluation_cycle_answers');
  }
}

module.exports = EvaluationCycleAnswerSchema;
