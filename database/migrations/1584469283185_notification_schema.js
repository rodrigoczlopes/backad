/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const { v4: uuidv4 } = require('uuid');

class NotificationSchema extends Schema {
  up() {
    this.create('notifications', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(uuidv4());
      table.boolean('read');
      table.string('content', 250);
      table
        .uuid('user')
        .unsigned()
        .references('id')
        .inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('notifications');
  }
}

module.exports = NotificationSchema;
