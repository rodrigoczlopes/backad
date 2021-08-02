/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const ContinuousFeedbackDevelopmentPlan = use('App/Models/ContinuousFeedbackDevelopmentPlan');

class ContinuousFeedbackDevelopmentPlanController {
  async index() {
    return ContinuousFeedbackDevelopmentPlan.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .fetch();
  }

  async store({ request, response, auth }) {
    const data = request.all();

    try {
      return ContinuousFeedbackDevelopmentPlan.create({
        ...data,
        created_by: auth.user.id,
      });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }

  async update({ params, request, response, auth }) {
    const data = request.only(['action', 'initial_date', 'final_date', 'leader_finished', 'status', 'fake_id']);

    try {
      const continuousFeedbackDevelopmentPlan = await ContinuousFeedbackDevelopmentPlan.find(params.id);
      await continuousFeedbackDevelopmentPlan.merge({
        ...data,
        updated_by: auth.user.id,
      });

      await continuousFeedbackDevelopmentPlan.save();
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }

  async destroy({ params }) {
    const continuousFeedbackDevPlan = await ContinuousFeedbackDevelopmentPlan.find(params.id);
    await continuousFeedbackDevPlan.delete();
  }
}

module.exports = ContinuousFeedbackDevelopmentPlanController;
