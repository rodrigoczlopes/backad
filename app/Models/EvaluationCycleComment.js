/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class EvaluationCycleComment extends Model {
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

  evaluationCycles() {
    return this.belongsTo('App/Models/EvaluationCycle');
  }

  employees() {
    return this.belongsTo('App/Models/User');
  }

  leaders() {
    return this.belongsTo('App/Models/User');
  }

  forms() {
    return this.belongsTo('App/Models/Form');
  }

  comments() {
    return this.belongsTo('App/Models/Comment');
  }
}

module.exports = EvaluationCycleComment;
