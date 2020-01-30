/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class HierarchySchema extends Schema {
  up() {
    this.create('hierarchies', table => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('hierarchies');
  }
}

module.exports = HierarchySchema;
