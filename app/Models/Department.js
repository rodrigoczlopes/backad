/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Department extends Model {
  static get incrementing() {
    return false;
  }
}

module.exports = Department;
