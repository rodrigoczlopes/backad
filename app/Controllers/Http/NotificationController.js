/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Notification = use('App/Models/Notification');

class NotificationController {
  async index({ auth }) {
    const notification = await Notification.query()
      .where('user', auth.user.id)
      .with('users', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .orderBy('created_at', 'desc')
      .fetch();
    return notification;
  }

  async store({ request, response }) {
    const data = request.all();
    const notification = await Notification.create(data);
    return response.status(201).json(notification);
  }

  async show({ params }) {
    const notification = await Notification.findOrFail(params.id);
    await notification.loadMany({ users: (builder) => builder.select(['id', 'name', 'email', 'avatar']) });
    return notification;
  }

  async update({ params, request }) {
    const data = request.only(['content', 'user', 'read', 'hidden']);

    const notification = await Notification.findOrFail(params.id);
    notification.merge(data);
    await notification.save();
    return notification;
  }

  async destroy({ params }) {
    const notification = await Notification.findOrFail(params.id);

    await notification.delete();
  }
}

module.exports = NotificationController;
