/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class BehaviorSchema extends Schema {
  up() {
    this.create('behaviors', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('company_id').references('id').inTable('companies').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('path_id').references('id').inTable('paths');
      table.uuid('skill_id').references('id').inTable('skills');
      table.string('description', 1000).notNullable();
      table.boolean('active');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('behaviors');
  }
}

module.exports = BehaviorSchema;
