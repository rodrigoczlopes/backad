/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Role extends Model {
  static boot() {
    super.boot();
    this.addHook('beforeUpdate', 'RemoveCreatedAtFieldOnUpdateHook.removeCreatedAt');
  }

  static get primaryKey() {
    return 'id';
  }

  permissions() {
    return this.hasMany('App/Models/PermissionRole', 'role_id', 'id');
  }
}

module.exports = Role;
