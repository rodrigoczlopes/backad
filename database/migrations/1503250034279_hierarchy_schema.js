/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

const { v4: uuidv4 } = require('uuid');

class HierarchySchema extends Schema {
  up() {
    this.create('hierarchies', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('company_id').references('id').inTable('companies').onDelete('SET NULL').onUpdate('CASCADE');
      table.string('description', 250);
      table.string('level', 250);
      table.boolean('active').notNullable();
      table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('hierarchies');
  }
}

module.exports = HierarchySchema;
