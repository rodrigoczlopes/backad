/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/**
 * Resourceful controller for interacting with usergroups
 */
class UserController {
  async index() {
    const users = await User.query()
      .with('userGroups')
      .fetch();
    return users;
  }

  async show({ params }) {
    const user = await User.find(params.id);
    await user.load('userGroups');
    return user;
  }

  async update({ params, request }) {
    const data = request.only([
      'name',
      'user_group_id',
      'registry',
      'username',
      'email',
      'password',
      'password_confirmation',
      'cpf',
      'active',
      'admitted_at',
      'fired_at',
    ]);
    const user = await User.find(params.id);
    user.merge(data);
    await user.save();
    return user;
  }

  async destroy({ params }) {
    const user = await User.find(params.id);

    await user.delete();
  }
}

module.exports = UserController;
