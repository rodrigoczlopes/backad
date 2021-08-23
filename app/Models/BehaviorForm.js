/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class BehaviorForm extends Model {
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

  createdBy() {
    return this.belongsTo('App/Models/User', 'created_by', 'id');
  }

  updatedBy() {
    return this.belongsTo('App/Models/User', 'updated_by', 'id');
  }

  forms() {
    return this.belongsTo('App/Models/Forms', 'form_id', 'id');
  }

  behaviors() {
    return this.belongsTo('App/Models/Behaviors', 'behavior_id', 'id');
  }

  companies() {
    return this.belongsTo('App/Models/Company', 'company_id', 'id');
  }
}

module.exports = BehaviorForm;
