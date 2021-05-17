/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Behavior = use('App/Models/Behavior');

class SkillBehaviorController {
  async index({ auth, params }) {
    if (params.id === 'undefined' || params.id === 'null') return [];
    const behaviorSkills = await Behavior.query()
      .where('path_id', params.id)
      .where('company_id', auth.user.company_id)
      .with('skills')
      .fetch();
    const behaviorJson = behaviorSkills.toJSON();
    const skills = behaviorJson.map((beh) => {
      return { id: beh.skills.id, name: beh.skills.name, path_id: beh.path_id };
    });

    const uniqueSkills = Array.from(skills.reduce((a, o) => a.set(o.name, o), new Map()).values());

    if (!skills) return null;

    const treeNode = uniqueSkills.map(async (skill) => {
      const behaviors = await Behavior.query().where('skill_id', skill.id).where('path_id', skill.path_id).fetch();
      const childrens =
        behaviors.toJSON().map((behavior) => ({ value: behavior.id, label: behavior.description, leaf: true, children: [] })) ||
        [];

      return {
        value: skill.id,
        label: skill.name,
        leaf: false,
        children: childrens,
      };
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
