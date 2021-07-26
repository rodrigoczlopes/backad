/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class DevelopmentPlanSchema extends Schema {
  up() {
    this.create('development_plans', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('company_id').references('id').inTable('companies').onDelete('SET NULL').onUpdate('CASCADE');
      table.string('action', 250).notNullable();
      table.string('description', 1000).notNullable();
      table.boolean('active');
      table.uuid('created_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('development_plans');
  }
}

module.exports = DevelopmentPlanSchema;
