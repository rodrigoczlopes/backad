/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class EvaluationCycleAnswer extends Model {
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

  evaluationCycles() {
    return this.belongsTo('App/Models/EvaluationCycle');
  }

  employees() {
    return this.belongsTo('App/Models/User');
  }

  leaders() {
    return this.belongsTo('App/Models/User');
  }

  conciliators() {
    return this.belongsTo('App/Models/User');
  }

  forms() {
    return this.belongsTo('App/Models/Form');
  }

  behaviors() {
    return this.belongsTo('App/Models/Behavior');
  }
}

module.exports = EvaluationCycleAnswer;
