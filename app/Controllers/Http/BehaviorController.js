/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Behavior = use('App/Models/Behavior');

const Redis = use('Redis');

class BehaviorController {
  async index({ request }) {
    const { page, itemsPerPage } = request.get();

    if (!page) {
      const cachedBehavior = await Redis.get('behaviors');

      if (cachedBehavior) {
        return JSON.parse(cachedBehavior);
      }

      const behaviors = await Behavior.query()
        .where({ deleted_at: null })
        .with('createdBy', (builder) => {
          builder.select(['id', 'name', 'email', 'avatar']);
        })
        .with('companies')
        .with('paths')
        .with('skills')
        .fetch();

      await Redis.set('behaviors', JSON.stringify(behaviors));
      return behaviors;
    }

    return Behavior.query()
      .where({ deleted_at: null })
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .with('paths')
      .with('skills')
      .paginate(page, itemsPerPage);
  }

  async store({ request, response, auth }) {
    const data = request.all();

    if (data.behaviors?.length > 0) {
      data.behaviors?.forEach(async (behaviorToAdd) => {
        const existBehaviorToAdd = await Behavior.query().where({ description: behaviorToAdd.description }).fetch();
        if (!existBehaviorToAdd) {
          Behavior.create(behaviorToAdd);
        }
      });

      return response.status(201).json({ message: 'Bulk data created successfully!' });
    }

    const existBehavior = await Behavior.query().where({ description: data.description }).first();

    if (!existBehavior) {
      const behavior = await Behavior.create({ ...data, created_by: auth.user.id });
      const behaviorReturn = await this.show({ params: { id: behavior.id } });
      await Redis.del('behaviors');
      return response.status(201).json(behaviorReturn);
    }
    return response.status(400).json({ message: 'Já existe um comportamento com esta descrição' });
  }

  async show({ params }) {
    const behavior = await Behavior.find(params.id);
    await behavior.loadMany({
      createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']),
      companies: null,
      paths: null,
      skills: null,
    });
    return behavior;
  }

  async update({ params, request, auth }) {
    const data = request.only(['description', 'path_id', 'skill_id', 'company_id', 'active', 'updated_by']);
    const behavior = await Behavior.find(params.id);
    behavior.merge({ ...data, updated_by: auth.user.id });
    await behavior.save();
    await Redis.del('behaviors');

    return behavior;
  }

  async destroy({ params }) {
    const behavior = await Behavior.find(params.id);
    behavior.merge({ deleted_at: new Date() });
    await behavior.save();
    await Redis.del('behaviors');
  }
}

module.exports = BehaviorController;
