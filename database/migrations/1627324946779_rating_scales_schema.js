/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RatingScalesSchema extends Schema {
  up() {
    this.table('rating_scales', (table) => {
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('rating_scales', (table) => {
      table.dropColumn('updated_by');
    });
  }
}

module.exports = RatingScalesSchema;
