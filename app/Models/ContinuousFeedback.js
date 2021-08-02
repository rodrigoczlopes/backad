/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ContinuousFeedback extends Model {
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

  employees() {
    return this.belongsTo('App/Models/User');
  }

  companies() {
    return this.belongsTo('App/Models/Company');
  }

  continuousFeedbackDevelopmentPlans() {
    return this.hasMany('App/Models/ContinuousFeedbackDevelopmentPlans');
  }

  createdBy() {
    return this.belongsTo('App/Models/User');
  }

  updatedBy() {
    return this.belongsTo('App/Models/User');
  }
}

module.exports = ContinuousFeedback;
