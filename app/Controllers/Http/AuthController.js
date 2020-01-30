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
    return { token };
  }
}

module.exports = AuthController;
