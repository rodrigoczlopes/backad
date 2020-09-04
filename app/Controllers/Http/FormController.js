/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Form = use('App/Models/Form');

class PathController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }

    if (searchSentence) {
      const formList = await Form.query()
        .where(searchBy, 'ilike', `%${searchSentence}%`)
        .with('companies')
        .with('paths')
        .orderBy(searchBy)
        .paginate(page, itemsPerPage);
      return formList;
    }

    const forms = await Form.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .with('paths')
      .orderBy('name')
      .paginate(page, itemsPerPage);

    return forms;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const form = await Form.create({ ...data, created_by: auth.user.id });
    const formReturn = await this.show({ params: { id: form.id } });
    return response.status(201).json(formReturn);
  }

  async show({ params }) {
    const form = await Form.find(params.id);
    await form.loadMany({
      createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']),
      companies: null,
      paths: null,
    });
    return form;
  }

  async update({ params, request, auth }) {
    const data = request.only(['name', 'observation', 'active', 'path_id', 'company_id', 'updated_by']);
    const form = await Form.find(params.id);
    form.merge({ ...data, updated_by: auth.user.id });
    await form.save();
    return form;
  }

  async destroy({ params }) {
    const form = await Form.find(params.id);

    await form.delete();
  }
}

module.exports = PathController;
