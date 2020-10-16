const { parseISO, isBefore, subHours } = require('date-fns');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use('App/Models/Token');

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

  async update() {
    return true;
  }
}

module.exports = ResetPasswordController;
