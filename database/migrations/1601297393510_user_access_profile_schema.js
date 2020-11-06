/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class UserAccessProfileSchema extends Schema {
  up() {
    this.create('user_access_profiles', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.uuid('company_id').references('id').inTable('companies').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('user_group_id').references('id').inTable('user_groups').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('user_access_profiles');
  }
}

module.exports = UserAccessProfileSchema;
