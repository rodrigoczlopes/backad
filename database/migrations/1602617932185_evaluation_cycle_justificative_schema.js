/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class EvaluationCycleJustificativeSchema extends Schema {
  up() {
    this.create('evaluation_cycle_justificatives', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('employee_id').references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('leader_id').references('id').inTable('users');
      table.uuid('form_id').references('id').inTable('forms');
      table.uuid('evaluation_cycle_id').references('id').inTable('evaluation_cycles');
      table.uuid('skill_id').references('id').inTable('skills');
      table.string('user_justificative');
      table.boolean('user_finished');
      table.string('leader_justificative');
      table.boolean('leader_finished');
      table.timestamps();
    });
  }

  down() {
    this.drop('evaluation_cycle_justificatives');
  }
}

module.exports = EvaluationCycleJustificativeSchema;
