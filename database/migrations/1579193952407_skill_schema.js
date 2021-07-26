/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class SkillSchema extends Schema {
  up() {
    this.create('skills', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('company_id').references('id').inTable('companies').onDelete('SET NULL').onUpdate('CASCADE');
      table.string('name', 250).notNullable();
      table.string('description', 1000).notNullable();
      table.boolean('final_average');
      table.boolean('active');
      table.uuid('created_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('skills');
  }
}

module.exports = SkillSchema;
