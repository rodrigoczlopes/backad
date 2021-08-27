/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class AnualTrainingBudgetSchema extends Schema {
  up() {
    this.create('anual_training_budgets', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.string('year');
      table.decimal('amount');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('anual_training_budgets');
  }
}

module.exports = AnualTrainingBudgetSchema;
