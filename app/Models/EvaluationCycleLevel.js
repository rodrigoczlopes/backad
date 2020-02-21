/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class EvaluationCycleLevel extends Model {
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
}

module.exports = EvaluationCycleLevel;
