/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class DevelopmentPlanSchema extends Schema {
  up() {
    this.create('development_plans', table => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('development_plans');
  }
}

module.exports = DevelopmentPlanSchema;
