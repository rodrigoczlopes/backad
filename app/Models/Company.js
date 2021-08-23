/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Company extends Model {
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

  users() {
    return this.hasMany('App/Models/User');
  }

  createdBy() {
    return this.belongsTo('App/Models/User', 'created_by', 'id');
  }

  updatedBy() {
    return this.belongsTo('App/Models/User', 'updated_by', 'id');
  }

  departments() {
    return this.hasMany('App/Models/Department');
  }

  hierarchies() {
    return this.hasMany('App/Models/Hierarchy');
  }

  paths() {
    return this.hasMany('App/Models/Path');
  }

  positions() {
    return this.hasMany('App/Models/Position');
  }

  skills() {
    return this.hasMany('App/Models/Skill');
  }

  behaviors() {
    return this.hasMany('App/Models/Behavior');
  }

  developmentPlans() {
    return this.hasMany('App/Models/DevelopmentPlan');
  }

  evaluationCycles() {
    return this.hasMany('App/Models/EvaluationCycle');
  }

  ratingScales() {
    return this.hasMany('App/Models/RatingScale');
  }

  questions() {
    return this.hasMany('App/Models/Question');
  }

  comments() {
    return this.hasMany('App/Models/Comment');
  }

  classifications() {
    return this.hasMany('App/Models/Classification');
  }

  forms() {
    return this.hasMany('App/Models/Form');
  }
}

module.exports = Company;
