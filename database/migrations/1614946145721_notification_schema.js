/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class NotificationSchema extends Schema {
  up() {
    this.table('notifications', (table) => {
      table.boolean('hidden');
    });
  }

  down() {
    this.table('notifications', (table) => {
      table.dropColumn('hidden');
    });
  }
}

module.exports = NotificationSchema;
