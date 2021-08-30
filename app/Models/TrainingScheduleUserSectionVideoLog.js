/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class TrainingScheduleUserSectionVideoLog extends Model {
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

  trainingScheduleSectionVideos() {
    return this.belongsTo('App/Models/TrainingScheduleSectionVideo', 'training_schedule_section_video_id', 'id');
  }

  createdBy() {
    return this.belongsTo('App/Models/User', 'created_by', 'id');
  }

  updatedBy() {
    return this.belongsTo('App/Models/User', 'updated_by', 'id');
  }
}

module.exports = TrainingScheduleUserSectionVideoLog;
