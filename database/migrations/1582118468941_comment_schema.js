/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class CommentSchema extends Schema {
  up() {
    this.create('comments', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('company_id').references('id').inTable('companies').onDelete('SET NULL').onUpdate('CASCADE');
      table.string('description', 250).notNullable();
      table.uuid('created_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('comments');
  }
}

module.exports = CommentSchema;
