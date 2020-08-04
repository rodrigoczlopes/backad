/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
const Ws = use('Ws');

class AuthController {
  async register({ request, response }) {
    const data = request.all();
    const user = await User.create(data);
    return response.status(201).json(user);
  }

  async authenticate({ request, auth }) {
    const { username, password } = request.all();
    const { token } = await auth.attempt(username, password);

    const { id, name, registry, email, avatar, user_group_id, active, company_id } = await User.findBy('username', username);
    const user = {
      id,
      username,
      name,
      registry,
      email,
      avatar,
      user_group_id,
      active,
      company_id,
    };

    // Logout the other sessions if theres's any
    const userChannel = Ws.getChannel('user:*').topic(`user:${user.id}`);
    if (userChannel) {
      userChannel.broadcastToAll('logout');
    }

    return { token, user };
  }
}

module.exports = AuthController;
