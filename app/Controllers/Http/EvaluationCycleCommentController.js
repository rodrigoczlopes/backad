/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleComment = use('App/Models/EvaluationCycleComment');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleDevelopmentPlan = use('App/Models/EvaluationCycleDevelopmentPlan');

const Redis = use('Redis');

class EvaluationCycleCommentController {
  async index({ request }) {
    const { evaluation_cycle_id, employee_id } = request.all();
    const evaluationCycleComment = await EvaluationCycleComment.query()
      .where({ employee_id })
      .where({ evaluation_cycle_id })
      .with('comments')
      .fetch();
    return evaluationCycleComment;
  }

  async store({ request, response }) {
    const data = request.all();
    const evaluationCycleComment = await EvaluationCycleComment.create({ ...data });

    return response.status(201).json(evaluationCycleComment);
  }

  async update({ request, response }) {
    const { comments } = request.only('comments');
    const { developmentPlans } = request.only('developmentPlans');

    comments.forEach(async (comment) => {
      const evaluationCycleComment = await EvaluationCycleComment.find(comment.id);
      evaluationCycleComment.merge(comment);
      await evaluationCycleComment.save();
    });

    developmentPlans?.forEach(async (plan) => {
      if (plan.id) {
        const evaluationCycleDevelopmentPlan = await EvaluationCycleDevelopmentPlan.find(plan.id);
        evaluationCycleDevelopmentPlan.merge(plan);
        await evaluationCycleDevelopmentPlan.save();
      } else {
        delete plan.id;
        const evaluationCycleDevelopmentPlan = await EvaluationCycleDevelopmentPlan.findBy('fake_id', plan.fake_id);

        if (evaluationCycleDevelopmentPlan) {
          evaluationCycleDevelopmentPlan.merge(plan);
          await evaluationCycleDevelopmentPlan.save();
        } else {
          EvaluationCycleDevelopmentPlan.create({ ...plan });
        }
      }
    });

    await Redis.del('dashboard-summary');

    return response.json({ status: 'ok' });
  }
}

module.exports = EvaluationCycleCommentController;
