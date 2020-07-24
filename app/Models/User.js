/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');
const Env = use('Env');

class User extends Model {
  static get computed() {
    return ['avatar_url'];
  }

  getAvatarUrl({ avatar }) {
    return `${Env.get('APP_URL')}/files/${avatar || 'placeholder.png'}`;
  }

  static boot() {
    super.boot();

    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  static get incrementing() {
    return false;
  }

  createGroup() {
    return this.hasMany('App/Models/UserGroup', 'id', 'created_by');
  }

  updateGroup() {
    return this.hasMany('App/Models/UserGroup', 'id', 'updated_by');
  }

  userGroups() {
    return this.belongsTo('App/Models/UserGroup');
  }

  createCompany() {
    return this.hasMany('App/Models/Company', 'id', 'created_by');
  }

  updateCompany() {
    return this.hasMany('App/Models/Company', 'id', 'updated_by');
  }

  companies() {
    return this.belongsTo('App/Models/Company');
  }

  createDepartment() {
    return this.hasMany('App/Models/Department', 'id', 'created_by');
  }

  updateDepartment() {
    return this.hasMany('App/Models/Department', 'id', 'updated_by');
  }

  departments() {
    return this.belongsTo('App/Models/Department');
  }

  createPath() {
    return this.hasMany('App/Models/Path', 'id', 'created_by');
  }

  updatePath() {
    return this.hasMany('App/Models/Path', 'id', 'updated_by');
  }

  positions() {
    return this.belongsTo('App/Models/Position');
  }

  createPosition() {
    return this.hasMany('App/Models/Position', 'id', 'created_by');
  }

  updatePosition() {
    return this.hasMany('App/Models/Position', 'id', 'updated_by');
  }

  hierarchies() {
    return this.belongsTo('App/Models/Hierarchy');
  }

  createHierarchy() {
    return this.hasMany('App/Models/Hierarchy', 'id', 'created_by');
  }

  updateHierarchy() {
    return this.hasMany('App/Models/Hierarchy', 'id', 'updated_by');
  }

  createSkill() {
    return this.hasMany('App/Models/Skill', 'id', 'created_by');
  }

  updateSkill() {
    return this.hasMany('App/Models/Skill', 'id', 'updated_by');
  }

  createBehavior() {
    return this.hasMany('App/Models/Behavior', 'id', 'created_by');
  }

  updateBehavior() {
    return this.hasMany('App/Models/Behavior', 'id', 'updated_by');
  }

  createDevelopmentPlan() {
    return this.hasMany('App/Models/DevelopmentPlan', 'id', 'created_by');
  }

  updateDevelopmentPlan() {
    return this.hasMany('App/Models/DevelopmentPlan', 'id', 'updated_by');
  }

  createEvaluationCycle() {
    return this.hasMany('App/Models/EvaluationCycle', 'id', 'created_by');
  }

  updateEvaluationCycle() {
    return this.hasMany('App/Models/EvaluationCycle', 'id', 'updated_by');
  }

  createEvaluationCycleArea() {
    return this.hasMany('App/Models/EvaluationCycleArea', 'id', 'created_by');
  }

  updateEvaluationCycleArea() {
    return this.hasMany('App/Models/EvaluationCycleArea', 'id', 'updated_by');
  }

  createEvaluationCycleLevel() {
    return this.hasMany('App/Models/EvaluationCycleLevel', 'id', 'created_by');
  }

  updateEvaluationCycleLevel() {
    return this.hasMany('App/Models/EvaluationCycleLevel', 'id', 'updated_by');
  }

  createForm() {
    return this.hasMany('App/Models/Form', 'id', 'created_by');
  }

  updateForm() {
    return this.hasMany('App/Models/Form', 'id', 'updated_by');
  }

  notifications() {
    return this.hasMany('App/Models/Notification', 'id', 'user');
  }

  tokens() {
    return this.hasMany('App/Models/Token');
  }
}

module.exports = User;
