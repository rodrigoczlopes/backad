/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const UserAccessProfile = use('App/Models/UserAccessProfile');
const Ws = use('Ws');

class AuthController {
  async register({ request, response, auth }) {
    const data = request.all();

    if (data.employees?.length > 0) {
      data.employees?.forEach((userToAdd) => {
        User.create(userToAdd);
      });

      return response.status(201).json({ message: 'ok' });
    }

    const accessProfile = request.only('user_access_profile');
    delete data.user_access_profile;
    const user = await User.create(data);

    if (accessProfile) {
      await accessProfile?.user_access_profile?.forEach((profile) => {
        UserAccessProfile.create({
          user_id: user.id,
          user_group_id: profile,
          created_by: auth.user.id,
          updated_by: auth.user.id,
        });
      });
    }
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
