/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Form = use('App/Models/Form');

class PathController {
  async index() {
    const forms = await Form.query()
      .with('createdBy', builder => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .with('paths')
      .fetch();
    return forms;
  }

  async store({ request, response }) {
    const data = request.all();
    const form = await Form.create(data);
    return response.status(201).json(form);
  }

  async show({ params }) {
    const form = await Form.find(params.id);
    await form.loadMany({
      createdBy: builder => builder.select(['id', 'name', 'email', 'avatar']),
      companies: null,
      paths: null,
    });
    return form;
  }

  async update({ params, request }) {
    const data = request.only(['name', 'observation', 'active', 'path_id', 'company_id', 'updated_by']);
    const form = await Form.find(params.id);
    form.merge(data);
    await form.save();
    return form;
  }

  async destroy({ params }) {
    const form = await Form.find(params.id);

    await form.delete();
  }
}

module.exports = PathController;
