/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class TrainingScheduleUser extends Model {
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
    return this.belongsTo('App/Models/User', 'employee_id', 'id');
  }

  trainingSchedules() {
    return this.belongsTo('App/Models/TrainingSchedule', 'training_schedule_id', 'id');
  }

  createdBy() {
    return this.belongsTo('App/Models/User', 'created_by', 'id');
  }

  updatedBy() {
    return this.belongsTo('App/Models/User', 'updated_by', 'id');
  }
}

module.exports = TrainingScheduleUser;
