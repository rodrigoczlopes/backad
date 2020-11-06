/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class EvaluationCycleAreaSchema extends Schema {
  up() {
    this.create('evaluation_cycle_areas', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('evaluation_cycle_id').references('id').inTable('evaluation_cycles').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('department_id').references('id').inTable('departments').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('evaluation_cycle_areas');
  }
}

module.exports = EvaluationCycleAreaSchema;
