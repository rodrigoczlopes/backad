/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class EvaluationCycleLevel extends Model {
  static get incrementing() {
    return false;
  }

  evaluationCycles() {
    return this.belongsTo('App/Models/EvaluationCycle');
  }
}

module.exports = EvaluationCycleLevel;
