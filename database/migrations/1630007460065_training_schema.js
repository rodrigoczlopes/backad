/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class TrainingSchema extends Schema {
  up() {
    this.create('trainings', (table) => {
      table.uuid('id').primary().defaultTo(uuidv4());
      table.string('description');
      table.boolean('in_loco');
      table.integer('category');
      table.string('name');
      table.string('objective');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('updated_by').references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('trainings');
  }
}

module.exports = TrainingSchema;
