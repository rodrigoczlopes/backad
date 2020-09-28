/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class UserAccessProfile extends Model {
  static boot() {
    super.boot();
    this.addHook('beforeCreate', 'UuidGeneratorHook.uuid');
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

  users() {
    return this.belongsTo('App/Models/User', 'user_id', 'id');
  }

  user_groups() {
    return this.belongsTo('App/Models/UserGroup', 'user_group_id', 'id');
  }

  companies() {
    return this.belongsTo('App/Models/Company', 'company_id', 'id');
  }
}

module.exports = UserAccessProfile;
