/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Permission extends Model {
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
}

module.exports = Permission;
