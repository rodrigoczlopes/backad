/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Hierarchy = use('App/Models/Hierarchy');

class HierarchyController {
  async index() {
    const hierarchies = await Hierarchy.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .orderBy('level')
      .fetch();
    return hierarchies;
  }

  async store({ request, response }) {
    const data = request.all();
    const hierarchy = await Hierarchy.create(data);
    return response.status(201).json(hierarchy);
  }

  async show({ params }) {
    const hierarchy = await Hierarchy.find(params.id);
    await hierarchy.loadMany({ createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return hierarchy;
  }

  async update({ params, request }) {
    const data = request.only(['description', 'level', 'company_id', 'active', 'updated_by']);
    const hierarchy = await Hierarchy.find(params.id);
    hierarchy.merge(data);
    await hierarchy.save();
    return hierarchy;
  }

  async destroy({ params }) {
    const hierarchy = await Hierarchy.find(params.id);

    await hierarchy.delete();
  }
}

module.exports = HierarchyController;
