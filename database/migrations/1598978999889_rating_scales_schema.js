/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RatingScalesSchema extends Schema {
  up() {
    this.table('rating_scales', (table) => {
      table.decimal('score');
    });
  }

  down() {
    this.table('rating_scales', (table) => {
      // reverse alternations
    });
  }
}

module.exports = RatingScalesSchema;
