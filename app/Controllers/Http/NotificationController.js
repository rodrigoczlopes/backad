/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Notification = use('App/Models/Notification');

const Redis = use('Redis');

class NotificationController {
  async index({ auth }) {
    const cachedNotifications = await Redis.get(`notifications_${auth.id}`);
    if (cachedNotifications) {
      return JSON.parse(cachedNotifications);
    }
    const notification = await Notification.query()
      .where('user', auth.user.id)
      .with('users', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .orderBy('created_at', 'desc')
      .fetch();

    await Redis.set(`notifications_${auth.id}`, JSON.stringify(notification));
    return notification;
  }

  async store({ request, response }) {
    const data = request.all();
    const notification = await Notification.create(data);
    await Redis.del(`notifications_${data.user}`);
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
    await Redis.del(`notifications_${data.user}`);
    return notification;
  }

  async destroy({ params }) {
    const notification = await Notification.findOrFail(params.id);
    await Redis.del(`notifications_${notification.user}`);
    await notification.delete();
  }
}

module.exports = NotificationController;
