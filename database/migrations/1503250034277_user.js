/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

const { v4: uuidv4 } = require('uuid');

class UserSchema extends Schema {
  up() {
    this.create('users', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.string('registry', 20).notNullable();
      table.string('username', 80).notNullable();
      table.string('name', 80).notNullable();
      table.string('email', 254).notNullable();
      table.string('password', 60).notNullable();
      table.string('cpf', 15).notNullable();
      table.string('avatar');
      table.boolean('active').notNullable();
      table.date('admitted_at').notNullable();
      table.date('fired_at');
      table.date('deleted_at');
      table.date('password_updated_at');
      table.uuid('user_group_id').references('id').inTable('user_groups').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('company_id').references('id').inTable('companies');
      table.uuid('department_id').references('id').inTable('departments');
      table.uuid('position_id').references('id').inTable('positions');
      table.uuid('hierarchy_id').references('id').inTable('hierarchies');
      table.timestamps();
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
