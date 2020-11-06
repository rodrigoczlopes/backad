/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

const { v4: uuidv4 } = require('uuid');

class PathSchema extends Schema {
  up() {
    this.create('paths', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.string('description', 250);
      table.uuid('company_id').references('id').inTable('companies').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
      table.uuid('updated_by').references('id').inTable('users').onDelete('SET NULL');
      table.timestamps();
    });
  }

  down() {
    this.drop('paths');
  }
}

module.exports = PathSchema;
