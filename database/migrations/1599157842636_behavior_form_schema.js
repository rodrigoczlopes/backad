/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class BehaviorFormSchema extends Schema {
  up() {
    this.create('behavior_forms', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('company_id').references('id').inTable('companies').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('form_id').references('id').inTable('forms');
      table.uuid('behavior_id').references('id').inTable('behaviors');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('behavior_forms');
  }
}

module.exports = BehaviorFormSchema;
