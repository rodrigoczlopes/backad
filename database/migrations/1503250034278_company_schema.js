/** @type {import('@adonisjs/lucid/src/Schema')} */
const { v4: uuidv4 } = require('uuid');

const Schema = use('Schema');

class CompanySchema extends Schema {
  up() {
    this.create('companies', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.string('name', 80).unique().notNullable();
      table.integer('code');
      table.uuid('created_by').unsigned().references('id').inTable('users');
      table.uuid('updated_by').unsigned().references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('companies');
  }
}

module.exports = CompanySchema;
