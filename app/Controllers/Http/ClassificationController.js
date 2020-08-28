/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Classification = use('App/Models/Classification');

class ClassificationController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }

    if (searchSentence) {
      const classifications = await Classification.query()
        .where(searchBy, 'ilike', `%${searchSentence}%`)
        .with('companies')
        .orderBy(searchBy)
        .paginate(page, itemsPerPage);
      return classifications;
    }

    const classification = await Classification.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .orderBy('initial_value')
      .paginate(page, itemsPerPage);
    return classification;
  }

  async store({ request, response }) {
    const data = request.all();
    const classification = await Classification.create(data);
    const classificationReturn = await this.show({ params: { id: classification.id } });
    return response.status(201).json(classificationReturn);
  }

  async show({ params }) {
    const classification = await Classification.find(params.id);
    await classification.loadMany({ createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return classification;
  }

  async update({ params, request }) {
    const data = request.only(['description', 'initial_value', 'final_value', 'company_id', 'updated_by']);
    const classification = await Classification.find(params.id);
    classification.merge(data);
    await classification.save();
    return classification;
  }

  async destroy({ params }) {
    const classification = await Classification.find(params.id);

    await classification.delete();
  }
}

module.exports = ClassificationController;
