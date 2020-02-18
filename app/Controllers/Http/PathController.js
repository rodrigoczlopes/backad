/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Path = use('App/Models/Path');

class PathController {
  async index() {
    const paths = await Path.query()
      .with('createdBy', builder => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .fetch();
    return paths;
  }

  async store({ request, response }) {
    const data = request.all();
    const path = await Path.create(data);
    return response.status(201).json(path);
  }

  async show({ params }) {
    const path = await Path.find(params.id);
    await path.loadMany({ createdBy: builder => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return path;
  }

  async update({ params, request }) {
    const data = request.only(['description', 'company_id']);
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
