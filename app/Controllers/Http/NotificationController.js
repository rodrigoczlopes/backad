/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Notification = use('App/Models/Notification');

class NotificationController {
  async index() {
    const notification = await Notification.query()
      .with('users', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .fetch();
    return notification;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const notification = await Notification.create({ ...data, created_by: auth.user.id });
    return response.status(201).json(notification);
  }

  async show({ params }) {
    const notification = await Notification.find(params.id);
    await notification.loadMany({ users: (builder) => builder.select(['id', 'name', 'email', 'avatar']) });
    return notification;
  }

  async update({ params, request, auth }) {
    const data = request.only(['content', 'user', 'read']);
    data.read = true;
    const notification = await Notification.find(params.id);
    notification.merge({ ...data, updated_by: auth.user.id });
    await notification.save();
    return notification;
  }

  async destroy({ params }) {
    const notification = await Notification.find(params.id);

    await notification.delete();
  }
}

module.exports = NotificationController;
