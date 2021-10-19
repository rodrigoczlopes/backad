/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Comment = use('App/Models/Comment');

class CommentController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }

    if (searchSentence) {
      return Comment.query().where(searchBy, 'like', `%${searchSentence}%`).orderBy(searchBy).paginate(page, itemsPerPage);
    }

    return Comment.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .orderBy('description')
      .paginate(page, itemsPerPage);
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const existsComment = await Comment.query().where({ description: data.description }).first();
    if (!existsComment) {
      const comment = await Comment.create({ ...data, created_by: auth.user.id });
      const commentReturn = await this.show({ params: { id: comment.id } });
      return response.status(201).json(commentReturn);
    }

    return response.status(400).json({ message: 'Já existe um comentário com esta descrição' });
  }

  async show({ params }) {
    const comment = await Comment.find(params.id);
    await comment.loadMany({ createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return comment;
  }

  async update({ params, request, auth }) {
    const data = request.only(['description', 'company_id', 'updated_by']);
    const comment = await Comment.find(params.id);
    comment.merge({ ...data, updated_by: auth.user.id });
    await comment.save();
    return comment;
  }

  async destroy({ params }) {
    const comment = await Comment.find(params.id);

    await comment.delete();
  }
}

module.exports = CommentController;
