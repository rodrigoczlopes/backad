/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Department extends Model {
  static get incrementing() {
    return false;
  }

  createdBy() {
    return this.belongsTo('App/Models/User', 'created_by', 'id');
  }

  updatedBy() {
    return this.belongsTo('App/Model/User', 'updated_by', 'id');
  }
}

module.exports = Department;
