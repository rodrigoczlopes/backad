/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class TrainingSchedule extends Model {
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

  trainings() {
    return this.belongsTo('App/Models/Training', 'training_id', 'id');
  }

  responsibles() {
    return this.belongsTo('App/Models/User', 'responsible_id', 'id');
  }

  employees() {
    return this.hasMany('App/Models/TrainingScheduleUser');
  }

  costs() {
    return this.hasMany('App/Models/TrainingScheduleCost');
  }

  sections() {
    return this.hasMany('App/Models/TrainingScheduleSection');
  }

  attendanceLists() {
    return this.hasMany('App/Models/TrainingScheduleAttendanceList');
  }

  evaluations() {
    return this.hasMany('App/Models/TrainingScheduleEvaluation');
  }

  createdBy() {
    return this.belongsTo('App/Models/User', 'created_by', 'id');
  }

  updatedBy() {
    return this.belongsTo('App/Models/User', 'updated_by', 'id');
  }
}

module.exports = TrainingSchedule;
