/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Role extends Model {
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

  permissions() {
    return this.hasMany('App/Models/PermissionRole', 'role_id', 'id');
  }
}

module.exports = Role;
