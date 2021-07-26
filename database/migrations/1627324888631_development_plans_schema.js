/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class DevelopmentPlansSchema extends Schema {
  up() {
    this.table('development_plans', (table) => {
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('development_plans', (table) => {
      table.dropColumn('updated_by');
    });
  }
}

module.exports = DevelopmentPlansSchema;
