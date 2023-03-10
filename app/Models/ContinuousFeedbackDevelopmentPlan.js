/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ContinuousFeedbackDevelopmentPlan extends Model {
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

  employees() {
    return this.belongsTo('App/Models/User');
  }

  leaders() {
    return this.belongsTo('App/Models/User');
  }

  continuousFeedbacks() {
    return this.belongsTo('App/Models/ContinuousFeedback');
  }

  developmentPlans() {
    return this.belongsTo('App/Models/DevelopmentPlan');
  }

  createdBy() {
    return this.belongsTo('App/Models/User');
  }

  updatedBy() {
    return this.belongsTo('App/Models/User');
  }
}

module.exports = ContinuousFeedbackDevelopmentPlan;
