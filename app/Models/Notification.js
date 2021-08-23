/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Notification extends Model {
  static boot() {
    super.boot();

    this.addHook('beforeCreate', 'UuidGeneratorHook.uuid');
    this.addHook('afterCreate', 'NotificationHook.sendWs');
    this.addHook('beforeUpdate', 'RemoveCreatedAtFieldOnUpdateHook.removeCreatedAt');
  }

  static get primaryKey() {
    return 'id';
  }

  static get incrementing() {
    return false;
  }

  users() {
    return this.belongsTo('App/Models/User', 'user', 'id');
  }
}

module.exports = Notification;
