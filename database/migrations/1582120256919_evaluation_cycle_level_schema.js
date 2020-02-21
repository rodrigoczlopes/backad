/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const uuidv4 = require('uuid/v4');

class EvaluationCycleLevelSchema extends Schema {
  up() {
    this.create('evaluation_cycle_levels', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(uuidv4());
      table
        .uuid('evaluation_cycle_id')
        .unsigned()
        .references('id')
        .inTable('evaluation_cycles')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table
        .uuid('hierarchy_id')
        .unsigned()
        .references('id')
        .inTable('hierarchies')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table
        .uuid('created_by')
        .unsigned()
        .references('id')
        .inTable('users');
      table
        .uuid('updated_by')
        .unsigned()
        .references('id')
        .inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('evaluation_cycle_levels');
  }
}

module.exports = EvaluationCycleLevelSchema;
