/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

const { v4: uuidv4 } = require('uuid');

class UserGroupSchema extends Schema {
  up() {
    this.create('user_groups', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('company_id').references('id').inTable('companies').onDelete('SET NULL').onUpdate('CASCADE');
      table.string('name', 80).notNullable();
      table.text('description');
      table.string('color').notNullable().defaultTo('#00995d');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('user_groups');
  }
}

module.exports = UserGroupSchema;
