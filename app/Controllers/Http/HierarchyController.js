/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Hierarchy = use('App/Models/Hierarchy');

const Redis = use('Redis');

class HierarchyController {
  async index({ request }) {
    const { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      const cachedHierarchies = await Redis.get('hierarchies');
      if (cachedHierarchies) {
        return JSON.parse(cachedHierarchies);
      }
      const allHierarchies = await Hierarchy.query()
        .with('createdBy', (builder) => {
          builder.select(['id', 'name', 'email', 'avatar']);
        })
        .with('companies')
        .orderBy('level')
        .fetch();
      await Redis.set('hierarchies', JSON.stringify(allHierarchies));
      return allHierarchies;
    }

    if (searchSentence) {
      const ratingScales = await Hierarchy.query()
        .where(searchBy, 'like', `%${searchSentence}%`)
        .with('companies')
        .orderBy(searchBy)
        .paginate(page, itemsPerPage);
      return ratingScales;
    }

    const hierarchies = await Hierarchy.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .orderBy('level')
      .paginate(page, itemsPerPage);

    return hierarchies;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const hierarchy = await Hierarchy.create({ ...data, created_by: auth.user.id });
    await Redis.del('hierarchies');
    return response.status(201).json(hierarchy);
  }

  async show({ params }) {
    const hierarchy = await Hierarchy.find(params.id);
    await hierarchy.loadMany({ createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return hierarchy;
  }

  async update({ params, request, auth }) {
    const data = request.only(['description', 'level', 'company_id', 'active', 'updated_by']);
    const hierarchy = await Hierarchy.find(params.id);
    hierarchy.merge({ ...data, updated_by: auth.user.id });
    await hierarchy.save();
    await Redis.del('hierarchies');
    return hierarchy;
  }

  async destroy({ params }) {
    const hierarchy = await Hierarchy.find(params.id);
    await Redis.del('hierarchies');
    await hierarchy.delete();
  }
}

module.exports = HierarchyController;
