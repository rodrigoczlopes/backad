/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const ContinuousFeedback = use('App/Models/ContinuousFeedback');

class ContinuousFeedbackController {
  async index() {
    return ContinuousFeedback.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .fetch();
  }

  async store({ request, response, auth }) {
    const data = request.all();

    try {
      return ContinuousFeedback.create({ ...data, created_by: auth.user.id });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }

  async update({ params, request, response, auth }) {
    try {
      const data = request.only('description', 'category', 'visible_to_employee');
      const continuousFeedback = await ContinuousFeedback.find(params.id);
      await continuousFeedback.merge({ ...data, updated_by: auth.user.id });
      await continuousFeedback.save();
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  }

  async destroy({ params }) {
    const continuousFeedback = await ContinuousFeedback.find(params.id);
    await continuousFeedback.delete();
  }
}

module.exports = ContinuousFeedbackController;
