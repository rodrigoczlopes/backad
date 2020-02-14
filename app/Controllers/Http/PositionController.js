/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Position = use('App/Models/Position');

class PositionController {
  async index() {
    const positions = await Position.query()
      .with('createdBy', builder => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .with('paths')
      .fetch();
    return positions;
  }

  async store({ request, response }) {
    const data = request.all();
    const position = await Position.create(data);
    return response.status(201).json(position);
  }

  async show({ params }) {
    const position = await Position.find(params.id);
    await position.loadMany({
      createdBy: builder => builder.select(['id', 'name', 'email', 'avatar']),
      companies: null,
      paths: null,
    });
    return position;
  }

  async update({ params, request }) {
    const data = request.only(['description', 'position_code']);
    const position = await Position.find(params.id);
    position.merge(data);
    await position.save();
    return position;
  }

  async destroy({ params }) {
    const position = await Position.find(params.id);

    await position.delete();
  }
}

module.exports = PositionController;
