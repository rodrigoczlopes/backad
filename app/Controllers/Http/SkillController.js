/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Skill = use('App/Models/Skill');

const Redis = use('Redis');

class SkillController {
  async index({ request }) {
    const { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();

    if (!page) {
      const cachedSkills = await Redis.get('skills');
      if (cachedSkills) {
        return JSON.parse(cachedSkills);
      }

      const skills = await Skill.query()
        .with('createdBy', (builder) => {
          builder.select(['id', 'name', 'email', 'avatar']);
        })
        .with('companies')
        .orderBy('name')
        .fetch();

      await Redis.set('skills', JSON.stringify(skills));
      return skills;
    }

    if (searchSentence) {
      return Skill.query()
        .where(searchBy, 'like', `%${searchSentence}%`)
        .with('companies')
        .orderBy(searchBy)
        .paginate(page, itemsPerPage);
    }

    return Skill.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .orderBy('name')
      .paginate(page, itemsPerPage);
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const skill = await Skill.create({ ...data, created_by: auth.user.id });
    await Redis.del('skills');
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
    await Redis.del('skills');
    return skill;
  }

  async destroy({ params }) {
    const skill = await Skill.find(params.id);
    await Redis.del('skills');
    await skill.delete();
  }
}

module.exports = SkillController;
