/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const uuidv4 = require('uuid/v4');

class DevelopmentPlanSchema extends Schema {
  up() {
    this.create('development_plans', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(uuidv4());
      table
        .uuid('company_id')
        .unsigned()
        .references('id')
        .inTable('companies')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table.string('action', 250).notNullable();
      table.string('description', 1000).notNullable();
      table.boolean('active');
      table.timestamps();
    });
  }

  down() {
    this.drop('development_plans');
  }
}

module.exports = DevelopmentPlanSchema;
