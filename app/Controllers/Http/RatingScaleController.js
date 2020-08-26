/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const RatingScale = use('App/Models/RatingScale');

class RatingScaleController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }
    const ratingScale = await RatingScale.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .orderBy('name')
      .paginate(page, itemsPerPage);

    return ratingScale;
  }

  async store({ request, response }) {
    const data = request.all();
    const ratingScale = await RatingScale.create(data);
    const ratingScaleReturn = await this.show({ params: { id: ratingScale.id } });
    return response.status(201).json(ratingScaleReturn);
  }

  async show({ params }) {
    const ratingScale = await RatingScale.find(params.id);
    await ratingScale.loadMany({ createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return ratingScale;
  }

  async update({ params, request }) {
    const data = request.only(['name', 'description', 'company_id', 'updated_by']);
    const ratingScale = await RatingScale.find(params.id);
    ratingScale.merge(data);
    await ratingScale.save();
    return ratingScale;
  }

  async destroy({ params }) {
    const ratingScale = await RatingScale.find(params.id);

    await ratingScale.delete();
  }
}

module.exports = RatingScaleController;
