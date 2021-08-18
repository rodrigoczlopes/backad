/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const ContinuousFeedback = use('App/Models/ContinuousFeedback');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const ContinuousFeedbackDevelopmentPlan = use('App/Models/ContinuousFeedbackDevelopmentPlan');

class ContinuousFeedbackController {
  async index() {
    return ContinuousFeedback.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .fetch();
  }

  async show({ params }) {
    const continuousFeedback = await ContinuousFeedback.find(params.id);
    await continuousFeedback.loadMany({
      continuousFeedbackDevelopmentPlans: (builder) =>
        builder.select([
          'id',
          'continuous_feedback_id',
          'employee_id',
          'leader_id',
          'action',
          'initial_date',
          'final_date',
          'fake_id',
        ]),
      employees: (employee) =>
        employee
          .select(['id', 'name', 'admitted_at', 'position_id'])
          .with('positions', (position) => position.select(['id', 'description'])),
    });
    return continuousFeedback;
  }

  async store({ request, response, auth }) {
    const { continuousFeedbackDevelopmentPlans, ...data } = request.all();

    try {
      const continuousFeedback = await ContinuousFeedback.create({ ...data, created_by: auth.user.id });

      if (continuousFeedbackDevelopmentPlans && continuousFeedbackDevelopmentPlans.length > 0) {
        continuousFeedbackDevelopmentPlans.forEach(async (actionPlan) => {
          delete actionPlan.id;
          await ContinuousFeedbackDevelopmentPlan.create({
            ...actionPlan,
            continuous_feedback_id: continuousFeedback.id,
            created_by: auth.user.id,
            leader_id: auth.user.id,
          });
        });
      }

      return response.status(201).json(continuousFeedback);
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }

  async update({ params, request, response, auth }) {
    try {
      const { continuousFeedbackDevelopmentPlans, ...data } = request.only([
        'description',
        'category',
        'visible_to_employee',
        'continuousFeedbackDevelopmentPlans',
      ]);
      const continuousFeedback = await ContinuousFeedback.find(params.id);
      await continuousFeedback.merge({ ...data, updated_by: auth.user.id });
      await continuousFeedback.save();

      if (continuousFeedbackDevelopmentPlans && continuousFeedbackDevelopmentPlans.length > 0) {
        continuousFeedbackDevelopmentPlans.forEach(async (actionPlan) => {
          const actionPlanToEdit = await ContinuousFeedbackDevelopmentPlan.find(actionPlan.id);
          await actionPlanToEdit.merge({
            ...actionPlan,
            updated_by: auth.user.id,
            leader_id: auth.user.id,
          });
          actionPlanToEdit.save();
        });
      }

      response.status(200).json({ message: 'Atualizado com sucesso' });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  }

  async destroy({ params }) {
    const continuousFeedbackDevelopmentPlans = await ContinuousFeedbackDevelopmentPlan.findBy({
      continuous_feedback_id: params.id,
    });
    await continuousFeedbackDevelopmentPlans.delete();

    const continuousFeedback = await ContinuousFeedback.find(params.id);
    await continuousFeedback.delete();
  }
}

module.exports = ContinuousFeedbackController;
