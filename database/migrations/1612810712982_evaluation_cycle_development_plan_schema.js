/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class EvaluationCycleDevelopmentPlanSchema extends Schema {
  up() {
    this.create('evaluation_cycle_development_plans', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('employee_id').references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('leader_id').references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('form_id').references('id').inTable('forms').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('evaluation_cycle_id').references('id').inTable('evaluation_cycles').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('development_plan_id').references('id').inTable('development_plans').onDelete('SET NULL').onUpdate('CASCADE');
      table.string('action');
      table.date('initial_date');
      table.date('final_date');
      table.boolean('leader_finished');
      table.string('status');
      table.timestamps();
    });
  }

  down() {
    this.drop('evaluation_cycle_development_plans');
  }
}

module.exports = EvaluationCycleDevelopmentPlanSchema;
