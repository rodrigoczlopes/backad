/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SkillsSchema extends Schema {
  up() {
    this.table('skills', (table) => {
      table.uuid('updated_by').references('id').inTable('users');
    });
  }

  down() {
    this.table('skills', (table) => {
      table.dropColumn('updated_by');
    });
  }
}

module.exports = SkillsSchema;
