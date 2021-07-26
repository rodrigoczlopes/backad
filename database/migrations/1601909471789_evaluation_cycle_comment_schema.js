/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class EvaluationCycleCommentSchema extends Schema {
  up() {
    this.create('evaluation_cycle_comments', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('employee_id').references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('leader_id').references('id').inTable('users');
      table.uuid('form_id').references('id').inTable('forms');
      table.uuid('evaluation_cycle_id').references('id').inTable('evaluation_cycles');
      table.string('leader_comment');
      table.timestamps();
    });
  }

  down() {
    this.drop('evaluation_cycle_comments');
  }
}

module.exports = EvaluationCycleCommentSchema;
