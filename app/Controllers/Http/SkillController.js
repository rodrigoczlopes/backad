/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Skill = use('App/Models/Skill');

class SkillController {
  async index() {
    const skills = await Skill.query()
      .with('createdBy', builder => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .fetch();
    return skills;
  }

  async store({ request, response }) {
    const data = request.all();
    const skill = await Skill.create(data);
    return response.status(201).json(skill);
  }

  async show({ params }) {
    const skill = await Skill.find(params.id);
    await skill.loadMany({ createdBy: builder => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return skill;
  }

  async update({ params, request }) {
    const data = request.only(['name', 'description', 'company_id', 'active']);
    const skill = await Skill.find(params.id);
    skill.merge(data);
    await skill.save();
    return skill;
  }

  async destroy({ params }) {
    const skill = await Skill.find(params.id);

    await skill.delete();
  }
}

module.exports = SkillController;
