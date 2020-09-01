/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Hierarchy = use('App/Models/Hierarchy');

class HierarchyController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }

    if (searchSentence) {
      const ratingScales = await Hierarchy.query()
        .where(searchBy, 'ilike', `%${searchSentence}%`)
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
    return hierarchy;
  }

  async destroy({ params }) {
    const hierarchy = await Hierarchy.find(params.id);

    await hierarchy.delete();
  }
}

module.exports = HierarchyController;
