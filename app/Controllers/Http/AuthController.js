/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class AuthController {
  async register({ request, response }) {
    const data = request.all();
    const user = await User.create(data);
    return response.status(201).json(user);
  }

  async authenticate({ request, auth }) {
    const { username, password } = request.all();
    const { token } = await auth.attempt(username, password);
    const { id, name, registry, email, avatar, user_group_id, active } = await User.findBy('username', username);
    const user = {
      id,
      username,
      name,
      registry,
      email,
      avatar,
      user_group_id,
      active,
    };
    return { token, user };
  }
}

module.exports = AuthController;
