/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Skill = use('App/Models/Skill');

class SkillController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }

    if (searchSentence) {
      const skillList = await Skill.query()
        .where(searchBy, 'ilike', `%${searchSentence}%`)
        .with('companies')
        .orderBy(searchBy)
        .paginate(page, itemsPerPage);
      return skillList;
    }

    const skills = await Skill.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .orderBy('name')
      .paginate(page, itemsPerPage);

    return skills;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const skill = await Skill.create({ ...data, created_by: auth.user.id });
    return response.status(201).json(skill);
  }

  async show({ params }) {
    const skill = await Skill.find(params.id);
    await skill.loadMany({ createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return skill;
  }

  async update({ params, request, auth }) {
    const data = request.only(['name', 'description', 'company_id', 'active', 'updated_by']);
    const skill = await Skill.find(params.id);
    skill.merge({ ...data, updated_by: auth.user.id });
    await skill.save();
    return skill;
  }

  async destroy({ params }) {
    const skill = await Skill.find(params.id);

    await skill.delete();
  }
}

module.exports = SkillController;
