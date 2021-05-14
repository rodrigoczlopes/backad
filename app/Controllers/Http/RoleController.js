const Role = use('Role');

const Redis = use('Redis');

class RoleController {
  async index() {
    const cachedRoles = await Redis.get('roles');
    if (cachedRoles) {
      return JSON.parse(cachedRoles);
    }
    const roles = await Role.query().with('permissions').orderBy('name', 'asc').fetch();
    await Redis.set('roles', JSON.stringify(roles));
    return roles;
  }

  async show({ params }) {
    const role = await Role.findOrFail(params.id);
    await role.load('permissions');
    return role;
  }

  async store({ request }) {
    const { permissions, ...data } = request.only(['name', 'slug', 'description', 'permissions']);

    const role = await Role.create(data);

    if (permissions) {
      await role.permissions().attach(permissions);
    }

    await role.load('permissions');
    await Redis.del('roles');

    return role;
  }

  async update({ request, params }) {
    const { permissions, ...data } = request.only(['name', 'slug', 'description', 'permissions']);

    const role = await Role.findOrFail(params.id);

    role.merge(data);
    role.save();

    if (permissions) {
      await role.permissions().sync(permissions);
    }

    await role.load('permissions');
    await Redis.del('roles');

    return role;
  }

  async destroy({ params }) {
    const role = await Role.findOrFail(params.id);
    await Redis.del('roles');
    await role.delete();
  }
}

module.exports = RoleController;
