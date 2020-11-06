/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.alter('users', (table) => {
      table.uuid('user_group_id').references('id').inTable('user_groups').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('company_id').references('id').inTable('companies').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('department_id').references('id').inTable('departments').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('position_id').references('id').inTable('positions').onDelete('SET NULL').onUpdate('CASCADE');
      table.uuid('hierarchy_id').references('id').inTable('hierarchies').onDelete('SET NULL').onUpdate('CASCADE');
    });
  }

  down() {
    this.alter('users', (table) => {
      table.dropColumn('user_group_id');
      table.dropColumn('company_id');
      table.dropColumn('department_id');
      table.dropColumn('position_id');
      table.dropColumn('hierarchy_id');
    });
  }
}

module.exports = UserSchema;
