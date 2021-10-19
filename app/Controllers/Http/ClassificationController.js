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
      return Classification.query()
        .where(searchBy, 'like', `%${searchSentence}%`)
        .with('companies')
        .orderBy(searchBy)
        .paginate(page, itemsPerPage);
    }

    return Classification.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .orderBy('initial_value')
      .paginate(page, itemsPerPage);
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const existClassification = await Classification.query().where({ description: data.description }).first();
    if (!existClassification) {
      const classification = await Classification.create({ ...data, created_by: auth.user.id });
      const classificationReturn = await this.show({ params: { id: classification.id } });
      return response.status(201).json(classificationReturn);
    }

    return response.status(400).json({ message: 'Já existe uma classificação com esta descrição' });
  }

  async show({ params }) {
    const classification = await Classification.find(params.id);
    await classification.loadMany({ createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return classification;
  }

  async update({ params, request, auth }) {
    const data = request.only(['description', 'initial_value', 'final_value', 'company_id', 'updated_by']);
    const classification = await Classification.find(params.id);
    classification.merge({ ...data, updated_by: auth.user.id });
    await classification.save();
    return classification;
  }

  async destroy({ params }) {
    const classification = await Classification.find(params.id);

    await classification.delete();
  }
}

module.exports = ClassificationController;
