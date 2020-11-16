/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Position = use('App/Models/Position');

class PositionController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }

    if (searchSentence) {
      const positionList = await Position.query()
        .where(searchBy, 'like', `%${searchSentence}%`)
        .with('companies')
        .with('paths')
        .orderBy(searchBy)
        .paginate(page, itemsPerPage);
      return positionList;
    }

    const positions = await Position.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .with('paths')
      .orderBy('description')
      .paginate(page, itemsPerPage);

    return positions;
  }

  async store({ request, response, auth }) {
    const data = request.all();

    if (data.Cargos) {
      data.Cargos.forEach((positions) => {
        Position.create({ ...positions, created_by: auth.user.id });
      });
      return response.status(201).json({ status: 'ok mano' });
    }

    const position = await Position.create({ ...data, created_by: auth.user.id });
    const positionReturn = await this.show({ params: { id: position.id } });
    return response.status(201).json(positionReturn);
  }

  async show({ params }) {
    const position = await Position.find(params.id);
    await position.loadMany({
      createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']),
      companies: null,
      paths: null,
    });
    return position;
  }

  async update({ params, request, auth }) {
    const data = request.only(['description', 'position_code', 'company_id', 'update_by']);
    const position = await Position.find(params.id);
    position.merge({ ...data, updated_by: auth.user.id });
    await position.save();
    return position;
  }

  async destroy({ params }) {
    const position = await Position.find(params.id);

    await position.delete();
  }
}

module.exports = PositionController;
