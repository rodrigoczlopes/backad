/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleComment = use('App/Models/EvaluationCycleComment');

class EvaluationCycleCommentController {
  async index({ request, response }) {}

  async store({ request, response, auth }) {
    const data = request.all();
    const evaluationCycleComment = await EvaluationCycleComment.create({ ...data, created_by: auth.user.id });
    const evaluationCycleCommentReturn = await this.show({ params: { id: evaluationCycleComment.id } });
    return response.status(201).json(evaluationCycleCommentReturn);
  }

  async show({ params, request, response }) {}

  async update({ params, request, response }) {}

  async destroy({ params, request, response }) {}
}

module.exports = EvaluationCycleCommentController;
