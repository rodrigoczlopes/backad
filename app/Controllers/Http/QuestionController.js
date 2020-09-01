/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Question = use('App/Models/Question');

class QuestionController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }

    if (searchSentence) {
      const questions = await Question.query()
        .where(searchBy, 'ilike', `%${searchSentence}%`)
        .orderBy(searchBy)
        .paginate(page, itemsPerPage);
      return questions;
    }

    const question = await Question.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .orderBy('description')
      .paginate(page, itemsPerPage);
    return question;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const question = await Question.create({ ...data, created_by: auth.user.id });
    const questionReturn = await this.show({ params: { id: question.id } });
    return response.status(201).json(questionReturn);
  }

  async show({ params }) {
    const question = await Question.find(params.id);
    await question.loadMany({ createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return question;
  }

  async update({ params, request, auth }) {
    const data = request.only(['description', 'company_id', 'updated_by']);
    const question = await Question.find(params.id);
    question.merge({ ...data, updated_by: auth.user.id });
    await question.save();
    return question;
  }

  async destroy({ params }) {
    const question = await Question.find(params.id);

    await question.delete();
  }
}

module.exports = QuestionController;
