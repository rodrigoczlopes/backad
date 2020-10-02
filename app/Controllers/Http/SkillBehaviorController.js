/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Behavior = use('App/Models/Behavior');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Skill = use('App/Models/Skill');

class SkillBehaviorController {
  async index({ auth }) {
    const skills = await Skill.query('company_id', auth.user.company_id).fetch();
    if (!skills) return null;

    const treeNode = skills.toJSON().map(async (skill) => {
      const behaviors = await Behavior.query().where('skill_id', skill.id).fetch();
      const childrens =
        behaviors.toJSON().map((behavior) => ({ value: behavior.id, label: behavior.description, leaf: true, children: [] })) ||
        [];

      const item = {
        value: skill.id,
        label: skill.name,
        leaf: false,
        children: childrens,
      };
      return item;
    });

    const trees = await Promise.all(treeNode);

    const root = {
      value: 'root',
      label: 'Comportamentos',
      children: trees,
    };
    return [root];
  }
}

module.exports = SkillBehaviorController;
