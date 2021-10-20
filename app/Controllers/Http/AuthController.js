/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

const Ws = use('Ws');
const Redis = use('Redis');

class AuthController {
  async register({ request, response }) {
    const { permissions, roles, ...data } = request.all();

    if (data.employees?.length > 0) {
      data.employees?.forEach((userToAdd) => {
        const userAlreadyExists = User.findBy('register', userToAdd.register);
        if (!userAlreadyExists) {
          User.create(userToAdd);
        }
      });

      return response.status(201).json({ message: 'ok' });
    }

    const user = await User.create(data);

    if (roles) {
      await user.roles().attach(roles);
    }

    if (permissions) {
      await user.permissions().attach(permissions);
    }

    await user.loadMany(['roles', 'permissions']);

    await Redis.del(`department-employee-list-${data.department_id}`);

    return user;
  }

  async authenticate({ response, request, auth }) {
    try {
      const { username, password } = request.all();
      const { token } = await auth.attempt(username, password);

      const userData = await User.findByOrFail('username', username);

      await userData.loadMany(['positions', 'hierarchies', 'departments', 'roles', 'permissions', 'userAccessProfiles']);

      const {
        id,
        name,
        registry,
        email,
        avatar,
        userAccessProfiles,
        active,
        company_id,
        hierarchies,
        positions,
        departments,
        roles,
        permissions,
      } = await userData.toJSON();

      const hierarchy = hierarchies?.description;
      const hierarchyLevel = hierarchies?.level;
      const position = positions?.description;
      const department = departments?.name;
      const departmentId = departments?.id;

      const user = {
        id,
        username,
        name,
        registry,
        email,
        avatar,
        userAccessProfiles,
        active,
        company_id,
        hierarchy,
        hierarchyLevel,
        position,
        department,
        departmentId,
        roles: roles?.map((rls) => rls.slug),
        permissions: permissions?.map((rls) => rls.slug),
      };

      // Logout the other sessions if theres's any
      const userChannel = Ws.getChannel('user:*').topic(`user:${user.id}`);
      if (userChannel) {
        userChannel.broadcastToAll('logout');
      }

      return { token, user };
    } catch (err) {
      if (err.authScheme) {
        return response.status(401).json({ message: 'PasswordMisMatchException' });
      }
      return err;
    }
  }
}

module.exports = AuthController;
