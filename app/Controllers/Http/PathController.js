/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Path = use('App/Models/Path');

const Redis = use('Redis');

class PathController {
  async index({ request }) {
    const { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      const cachedPaths = await Redis.get('paths');

      if (cachedPaths) {
        return JSON.parse(cachedPaths);
      }

      const paths = await Path.query()
        .with('createdBy', (builder) => {
          builder.select(['id', 'name', 'email', 'avatar']);
        })
        .with('companies')
        .orderBy('description')
        .fetch();

      await Redis.set('paths', JSON.stringify(paths));
      return paths;
    }

    if (searchSentence) {
      return Path.query()
        .where(searchBy, 'like', `%${searchSentence}%`)
        .with('companies')
        .orderBy(searchBy)
        .paginate(page, itemsPerPage);
    }

    return Path.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .orderBy('description')
      .paginate(page, itemsPerPage);
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const path = await Path.create({ ...data, created_by: auth.user.id });
    const pathReturn = await this.show({ params: { id: path.id } });
    await Redis.del(`paths`);
    return response.status(201).json(pathReturn);
  }

  async show({ params }) {
    const path = await Path.find(params.id);
    await path.loadMany({ createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return path;
  }

  async update({ params, request, auth }) {
    const data = request.only(['description', 'company_id', 'updated_by']);
    const path = await Path.find(params.id);
    path.merge({ ...data, updated_by: auth.user.id });
    await path.save();
    await Redis.del(`paths`);
    return path;
  }

  async destroy({ params }) {
    const path = await Path.find(params.id);

    await path.delete();
  }
}

module.exports = PathController;
