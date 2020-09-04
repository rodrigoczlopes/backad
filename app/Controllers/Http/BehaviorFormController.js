/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const BehaviorForm = use('App/Models/BehaviorForm');

class BehaviorFormController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }
    const behaviorForms = await BehaviorForm.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .with('forms')
      .with('behaviors')
      .paginate(page, itemsPerPage);
    return behaviorForms;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const behaviorForm = await BehaviorForm.create({ ...data, created_by: auth.user.id });
    const behaviorFormReturn = await this.show({ params: { id: behaviorForm.id } });
    return response.status(201).json(behaviorFormReturn);
  }

  async show({ params }) {
    const behaviorForm = await BehaviorForm.find(params.id);
    await behaviorForm.loadMany({
      createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']),
      companies: null,
      forms: null,
      behaviors: null,
    });
    return behaviorForm;
  }

  async update({ params, request, auth }) {
    const data = request.only(['description', 'forms_id', 'behavior_id', 'company_id', 'updated_by']);
    const behaviorForm = await BehaviorForm.find(params.id);
    behaviorForm.merge({ ...data, updated_by: auth.user.id });
    await behaviorForm.save();
    return behaviorForm;
  }

  async destroy({ params }) {
    const behaviorForm = await BehaviorForm.find(params.id);
    await behaviorForm.delete();
  }
}

module.exports = BehaviorFormController;
