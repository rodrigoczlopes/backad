/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class TrainingScheduleEvaluationScore extends Model {
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

  trainingScheduleEvaluations() {
    return this.belongsTo('App/Models/TrainingScheduleEvaluation', 'training_schedule_evaluation_id', 'id');
  }

  trainingEvaluationQuestions() {
    return this.belongsTo('App/Models/TrainingEvaluationQuestion', 'training_evaluation_question_id', 'id');
  }

  createdBy() {
    return this.belongsTo('App/Models/User', 'created_by', 'id');
  }

  updatedBy() {
    return this.belongsTo('App/Models/User', 'updated_by', 'id');
  }
}

module.exports = TrainingScheduleEvaluationScore;
