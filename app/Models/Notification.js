/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Notification extends Model {
  static get incrementing() {
    return false;
  }

  users() {
    return this.belongsTo('App/Models/User', 'user', 'id');
  }
}

module.exports = Notification;
