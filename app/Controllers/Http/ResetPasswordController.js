const { parseISO, isBefore, subHours } = require('date-fns');
const { generate } = require('generate-password');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

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
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 60);

    try {
      const data = request.all();
      if (data.allUsers) {
        const allActiveUsers = await User.query()
          .whereRaw('(password_updated_at <= ? or password_updated_at is null)', currentDate)
          .where({ active: true })
          .with('roles')
          .fetch();

        const allUsersJson = await allActiveUsers.toJSON();
        const withoutAdministratos = allUsersJson.filter(
          (user) => user.roles.filter((role) => role.slug === 'administrator').length === 0
        );

        const promises = withoutAdministratos.map(async (user) => {
          const userToResetPassword = await User.find(user.id);
          const password = generate({ length: 10, uppercase: false, symbols: false, numbers: true, exclude: ['l', 'o'] });
          userToResetPassword.password = password;
          userToResetPassword.password_updated_at = new Date();
          userToResetPassword.save();
        });

        await Promise.all(promises);

        return response.status(200).json({ status: true, message: 'Todos as senhas foram trocadas com sucesso!' });
      }

      const userToUpdate = await User.find(data.id);
      userToUpdate.password = data.password;
      userToUpdate.password_updated_at = new Date();
      userToUpdate.save();
      return response.status(200).json({ status: true, message: 'Senha alterada com sucesso' });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }
}

module.exports = ResetPasswordController;
