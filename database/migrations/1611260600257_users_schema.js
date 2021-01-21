/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UsersSchema extends Schema {
  up() {
    this.table('users', (table) => {
      table.date('final_employee_evaluation');
      table.date('initial_employee_evaluation');
    });
  }

  down() {
    this.table('users', (table) => {
      table.dropColumn('final_employee_evaluation');
      table.dropColumn('initial_employee_evaluation');
    });
  }
}

module.exports = UsersSchema;
