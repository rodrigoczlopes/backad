/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class TrainingTestimonial extends Model {
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

  trainingInstructors() {
    return this.belongsTo('App/Models/TrainingInstructor', 'training_instructor_id', 'id');
  }

  createdBy() {
    return this.belongsTo('App/Models/User', 'created_by', 'id');
  }

  updatedBy() {
    return this.belongsTo('App/Models/User', 'updated_by', 'id');
  }
}

module.exports = TrainingTestimonial;
