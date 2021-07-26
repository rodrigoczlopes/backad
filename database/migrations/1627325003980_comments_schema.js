/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CommentsSchema extends Schema {
  up() {
    this.table('comments', (table) => {
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('comments', (table) => {
      table.dropColumn('updated_by');
    });
  }
}

module.exports = CommentsSchema;
