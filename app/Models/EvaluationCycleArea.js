/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class EvaluationCycleArea extends Model {
  static get incrementing() {
    return false;
  }

  evaluationCycles() {
    return this.belongsTo('App/Models/EvaluationCycle');
  }
}

module.exports = EvaluationCycleArea;
