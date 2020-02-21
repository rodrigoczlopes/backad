/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Question = use('App/Models/Question');

class QuestionController {
  async index() {
    const question = await Question.query()
      .with('createdBy', builder => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .fetch();
    return question;
  }

  async store({ request, response }) {
    const data = request.all();
    const question = await Question.create(data);
    return response.status(201).json(question);
  }

  async show({ params }) {
    const question = await Question.find(params.id);
    await question.loadMany({ createdBy: builder => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return question;
  }

  async update({ params, request }) {
    const data = request.only(['description', 'company_id', 'updated_by']);
    const question = await Question.find(params.id);
    question.merge(data);
    await question.save();
    return question;
  }

  async destroy({ params }) {
    const question = await Question.find(params.id);

    await question.delete();
  }
}

module.exports = QuestionController;
