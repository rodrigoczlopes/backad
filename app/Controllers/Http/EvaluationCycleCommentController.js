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
      .fetch();
    return evaluationCycleComment;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const evaluationCycleComment = await EvaluationCycleComment.create({ ...data, created_by: auth.user.id });
    const evaluationCycleCommentReturn = await this.show({ params: { id: evaluationCycleComment.id } });
    return response.status(201).json(evaluationCycleCommentReturn);
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
