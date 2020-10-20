const { parseISO, isBefore, subHours } = require('date-fns');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use('App/Models/Token');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
/*
TODO:
- Montar o método Update para resetar a senha pelo Administrador
*/

class ResetPasswordController {
  async store({ request, response }) {
    const { token, password } = request.only(['token', 'password']);

    const userToken = await Token.findByOrFail('token', token);
    if (isBefore(parseISO(userToken.created_at), subHours(new Date(), 2))) {
      return response.status(400).json({ error: 'Invalid date range, please try again' });
    }

    const user = await userToken.user().fetch();
    user.password = password;
    await user.save();
  }

  async update({ request }) {
    const data = request.all();
    data.forEach(async (user) => {
      const userToAlter = await User.find(user.id);
      userToAlter.password = user.password;
      userToAlter.save();
    });
    return true;
  }
}

module.exports = ResetPasswordController;
