/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleComment = use('App/Models/EvaluationCycleComment');

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
    const { data } = request.only('data');

    data.forEach(async (comment) => {
      const evaluationCycleComment = await EvaluationCycleComment.find(comment.id);
      evaluationCycleComment.merge(comment);
      await evaluationCycleComment.save();
    });

    return response.json({ status: 'ok' });
  }
}

module.exports = EvaluationCycleCommentController;
