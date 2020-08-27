/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Path = use('App/Models/Path');

class PathController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }

    if (searchSentence) {
      const pathsList = await Path.query()
        .where(searchBy, 'ilike', `%${searchSentence}%`)
        .with('companies')
        .orderBy(searchBy)
        .paginate(page, itemsPerPage);
      return pathsList;
    }

    const paths = await Path.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .orderBy('description')
      .paginate(page, itemsPerPage);

    return paths;
  }

  async store({ request, response }) {
    const data = request.all();
    const path = await Path.create(data);
    const pathReturn = await this.show({ params: { id: path.id } });
    return response.status(201).json(pathReturn);
  }

  async show({ params }) {
    const path = await Path.find(params.id);
    await path.loadMany({ createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return path;
  }

  async update({ params, request }) {
    const data = request.only(['description', 'company_id', 'updated_by']);
    const path = await Path.find(params.id);
    path.merge(data);
    await path.save();
    return path;
  }

  async destroy({ params }) {
    const path = await Path.find(params.id);

    await path.delete();
  }
}

module.exports = PathController;
