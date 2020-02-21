/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Comment = use('App/Models/Comment');

class CommentController {
  async index() {
    const comment = await Comment.query()
      .with('createdBy', builder => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('companies')
      .fetch();
    return comment;
  }

  async store({ request, response }) {
    const data = request.all();
    const comment = await Comment.create(data);
    return response.status(201).json(comment);
  }

  async show({ params }) {
    const comment = await Comment.find(params.id);
    await comment.loadMany({ createdBy: builder => builder.select(['id', 'name', 'email', 'avatar']), companies: null });
    return comment;
  }

  async update({ params, request }) {
    const data = request.only(['description', 'company_id', 'updated_by']);
    const comment = await Comment.find(params.id);
    comment.merge(data);
    await comment.save();
    return comment;
  }

  async destroy({ params }) {
    const comment = await Comment.find(params.id);

    await comment.delete();
  }
}

module.exports = CommentController;
