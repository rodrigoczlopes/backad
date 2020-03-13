/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.alter('users', table => {
      table
        .uuid('user_group_id')
        .unsigned()
        .references('id')
        .inTable('user_groups')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table
        .uuid('company_id')
        .unsigned()
        .references('id')
        .inTable('companies')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table
        .uuid('department_id')
        .unsigned()
        .references('id')
        .inTable('departments')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table
        .uuid('position_id')
        .unsigned()
        .references('id')
        .inTable('positions')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table
        .uuid('hierarchy_id')
        .unsigned()
        .references('id')
        .inTable('hierarchies')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
    });
  }

  down() {
    this.alter('users', table => {
      //
    });
  }
}

module.exports = UserSchema;
