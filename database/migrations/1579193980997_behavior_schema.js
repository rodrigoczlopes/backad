/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class BehaviorSchema extends Schema {
  up() {
    this.create('behaviors', table => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('behaviors');
  }
}

module.exports = BehaviorSchema;
