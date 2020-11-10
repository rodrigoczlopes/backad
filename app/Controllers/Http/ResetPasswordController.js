const { parseISO, isBefore, subHours } = require('date-fns');
const { generate } = require('generate-password');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use('App/Models/Token');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

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

  async update({ request, response }) {
    try {
      const data = request.all();
      if (data.allUsers) {
        const allActiveUsers = await User.query()
          .where('active', true)
          .with('userAccessProfiles', (builder) => {
            builder.with('user_groups', (builderr) => {
              builderr.where('name', '<>', 'Administrador');
            });
          })
          .fetch();

        const allUsersJson = allActiveUsers.toJSON();
        allUsersJson.forEach(async (user) => {
          const userToAlter = await User.find(user.id);
          const password = generate({ length: 10, uppercase: false, symbols: false, numbers: true, exclude: ['l'] });
          userToAlter.password = password;
          userToAlter.save();
        });
        return response.status(200).json({ status: true, message: 'Todos as senhas foram trocadas com sucesso!' });
      }

      const userToUpdate = await User.find(data.id);
      userToUpdate.password = data.password;
      userToUpdate.save();
      return response.status(200).json({ status: true, message: 'Senha alterada com sucesso' });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }
}

module.exports = ResetPasswordController;
