/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Behavior = use('App/Models/Behavior');

class SkillBehaviorController {
  async index({ params }) {
    const behavior = await Behavior.query().where('skill_id', params.id).fetch();
    return behavior;
  }
}

module.exports = SkillBehaviorController;
