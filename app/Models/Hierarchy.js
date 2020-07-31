/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Hierarchy extends Model {
  static boot() {
    super.boot();
    this.addHook('beforeCreate', 'UuidGeneratorHook.uuid');
  }

  static get incrementing() {
    return false;
  }

  static get primaryKey() {
    return 'id';
  }

  createdBy() {
    return this.belongsTo('App/Models/User', 'created_by', 'id');
  }

  updatedBy() {
    return this.belongsTo('App/Models/User', 'updated_by', 'id');
  }

  companies() {
    return this.belongsTo('App/Models/Company', 'company_id', 'id');
  }
}

module.exports = Hierarchy;
