/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Skill extends Model {
  static get incrementing() {
    return false;
  }
}

module.exports = Skill;
