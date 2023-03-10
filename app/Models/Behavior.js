/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Behavior extends Model {
  static boot() {
    super.boot();
    this.addHook('beforeCreate', 'UuidGeneratorHook.uuid');
    this.addHook('beforeUpdate', 'RemoveCreatedAtFieldOnUpdateHook.removeCreatedAt');
  }

  static get primaryKey() {
    return 'id';
  }

  static get incrementing() {
    return false;
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

  paths() {
    return this.belongsTo('App/Models/Path', 'path_id', 'id');
  }

  skills() {
    return this.belongsTo('App/Models/Skill', 'skill_id', 'id');
  }

  behaviorForms() {
    return this.hasMany('App/Models/BehaviorForm');
  }
}

module.exports = Behavior;
