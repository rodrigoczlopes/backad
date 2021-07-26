/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class BehaviorsSchema extends Schema {
  up() {
    this.table('behaviors', (table) => {
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('behaviors', (table) => {
      table.dropColumn('updated_by');
    });
  }
}

module.exports = BehaviorsSchema;
