/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Token extends Model {
  static get incrementing() {
    return false;
  }

  user() {
    return this.belongsTo('App/Models/User');
  }
}

module.exports = Token;
