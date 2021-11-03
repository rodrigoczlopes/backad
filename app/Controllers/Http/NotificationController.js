/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Notification = use('App/Models/Notification');

const Redis = use('Redis');

class NotificationController {
  async index({ auth }) {
    const cachedNotifications = await Redis.get(`notifications_${auth.user.id}`);
    if (cachedNotifications) {
      return JSON.parse(cachedNotifications);
    }
    const notifications = await Notification.query()
      .where('user', auth.user.id)
      .with('users', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .orderBy('created_at', 'desc')
      .fetch();

    await Redis.set(`notifications_${auth.user.id}`, JSON.stringify(notifications));
    return notifications;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const notification = await Notification.create(data);
    await Redis.del(`notifications_${auth.user.id}`);
    return response.status(201).json(notification);
  }

  async show({ params, auth }) {
    const notification = await Notification.findOrFail(params.id);
    await notification.loadMany({ users: (builder) => builder.select(['id', 'name', 'email', 'avatar']) });
    return notification;
  }

  async update({ params, request, auth }) {
    const data = request.only(['content', 'user', 'read', 'hidden']);

    const notification = await Notification.findOrFail(params.id);
    notification.merge(data);
    await notification.save();
    await Redis.del(`notifications_${auth.user.id}`);
    return notification;
  }

  async destroy({ params, auth }) {
    const notification = await Notification.findOrFail(params.id);
    await Redis.del(`notifications_${auth.user.id}`);
    await notification.delete();
  }
}

module.exports = NotificationController;
