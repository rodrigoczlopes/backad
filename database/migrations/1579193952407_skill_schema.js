/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SkillSchema extends Schema {
  up() {
    this.create('skills', table => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('skills');
  }
}

module.exports = SkillSchema;
