/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleAnswer = use('App/Models/EvaluationCycleAnswer');

class EvaluationCycleAnswerController {
  async index({ request, response }) {}

  async store({ request, response, auth }) {
    const data = request.all();
    const evaluationCycleAnswer = await EvaluationCycleAnswer.create({ ...data, created_by: auth.user.id });
    const evaluationCycleAnswerReturn = await this.show({ params: { id: evaluationCycleAnswer.id } });
    return response.status(201).json(evaluationCycleAnswerReturn);
  }

  async show({ params, request, response }) {}

  async update({ params, request, response }) {}

  async destroy({ params, request, response }) {}
}

module.exports = EvaluationCycleAnswerController;
