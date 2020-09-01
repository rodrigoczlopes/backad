/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const RatingScale = use('App/Models/RatingScale');

class RatingScaleController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }

    if (searchSentence) {
      const ratingScales = await RatingScale.query()
        .where(searchBy, 'ilike', `%${searchSentence}%`)
        .orderBy('score')
        .paginate(page, itemsPerPage);
      return ratingScales;
    }

    const ratingScale = await RatingScale.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .orderBy('score')
      .paginate(page, itemsPerPage);
    return ratingScale;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const ratingScale = await RatingScale.create({ ...data, created_by: auth.user.id });
    const ratingScaleReturn = await this.show({ params: { id: ratingScale.id } });
    return response.status(201).json(ratingScaleReturn);
  }

  async show({ params }) {
    const ratingScale = await RatingScale.find(params.id);
    await ratingScale.loadMany({ createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return ratingScale;
  }

  async update({ params, request, auth }) {
    const data = request.only(['name', 'description', 'score', 'company_id', 'updated_by']);
    const ratingScale = await RatingScale.find(params.id);
    ratingScale.merge({ ...data, updated_by: auth.user.id });
    await ratingScale.save();
    return ratingScale;
  }

  async destroy({ params }) {
    const ratingScale = await RatingScale.find(params.id);

    await ratingScale.delete();
  }
}

module.exports = RatingScaleController;
