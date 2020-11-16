/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Form = use('App/Models/Form');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const BehaviorForm = use('App/Models/BehaviorForm');

class FormController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }

    if (searchSentence) {
      const formList = await Form.query()
        .where(searchBy, 'like', `%${searchSentence}%`)
        .with('companies')
        .with('paths')
        .with('behaviorForms')
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
      .with('behaviorForms')
      .orderBy('name')
      .paginate(page, itemsPerPage);

    return forms;
  }

  async store({ request, response, auth }) {
    const data = request.only(['active', 'company_id', 'name', 'observation', 'path_id']);
    const listBehaviors = request.only('behaviors');
    const form = await Form.create({ ...data, created_by: auth.user.id });

    const behaviorForm = listBehaviors?.behaviors?.map((behavior) => ({
      form_id: form.id,
      behavior_id: behavior,
      company_id: data.company_id,
      created_by: auth.user.id,
    }));
    await BehaviorForm.createMany(behaviorForm);
    const formReturn = await this.show({ params: { id: form.id } });
    return response.status(201).json(formReturn);
  }

  async show({ params }) {
    const form = await Form.find(params.id);
    await form.loadMany({
      createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']),
      companies: null,
      behaviorForms: null,
      paths: null,
    });
    return form;
  }

  async update({ params, request, auth }) {
    const data = request.only(['name', 'observation', 'active', 'path_id', 'company_id']);
    const listBehaviors = request.only('behaviors');

    const form = await Form.find(params.id);
    form.merge({ ...data, updated_by: auth.user.id });
    await form.save();

    await BehaviorForm.query().where({ form_id: form.id }).delete();
    const behaviorForm = listBehaviors?.behaviors?.map((behavior) => ({
      form_id: form.id,
      behavior_id: behavior,
      company_id: data.company_id,
      created_by: auth.user.id,
    }));
    await BehaviorForm.createMany(behaviorForm);
    return form;
  }

  async destroy({ params }) {
    const form = await Form.find(params.id);

    await form.delete();
  }
}

module.exports = FormController;
