/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class BehaviorsSchema extends Schema {
  up() {
    this.table('behaviors', (table) => {
      table.date('deleted_at');
    });
  }

  down() {
    this.table('behaviors', (table) => {
      table.dropColumn('deleted_at');
    });
  }
}

module.exports = BehaviorsSchema;
