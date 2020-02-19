/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const uuidv4 = require('uuid/v4');

class EvaluationCycleSchema extends Schema {
  up() {
    this.create('evaluation_cycles', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(uuidv4());
      table
        .uuid('company_id')
        .unsigned()
        .references('id')
        .inTable('companies')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table.string('description', 250).notNullable();
      table.date('initial_evaluation_period').notNullable();
      table.date('final_evaluation_period').notNullable();
      table.date('initial_manager_feedback').notNullable();
      table.date('final_manager_feedback').notNullable();
      table.boolean('complexity_level');
      table.boolean('justificative');
      table.boolean('comment');
      table.integer('make_report_available');
      table.integer('average_type');
      table.integer('feedback_type');
      table.integer('quantity_pair').notNullable();
      table.integer('quantity_subordinate').notNullable();
      table.integer('quantity_manager').notNullable();
      table.integer('quantity_inferior');
      table.integer('quantity_superior');
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
    this.drop('evaluation_cycles');
  }
}

module.exports = EvaluationCycleSchema;
