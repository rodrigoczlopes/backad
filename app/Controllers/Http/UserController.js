/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class UserController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }

    if (searchSentence) {
      const usersList = await User.query()
        .where(searchBy, 'like', `%${searchSentence}%`)
        .with('roles')
        .with('companies')
        .with('departments')
        .with('positions')
        .with('hierarchies')
        .orderBy(searchBy, 'asc')
        .paginate(page, itemsPerPage);
      return usersList;
    }

    const users = await User.query()
      .with('roles')
      .with('companies')
      .with('departments')
      .with('positions')
      .with('hierarchies')
      .orderBy('name', 'asc')
      .paginate(page, itemsPerPage);

    return users;
  }

  async show({ params }) {
    const user = await User.findOrFail(params.id);
    await user.load('companies');
    await user.load('positions');
    await user.load('userAccessProfiles');
    await user.load('roles');
    await user.load('permissions');

    return user;
  }

  async update({ params, request }) {
    const { permissions, roles, ...data } = request.only([
      'name',
      'user_group_id',
      'company_id',
      'hierarchy_id',
      'position_id',
      'department_id',
      'registry',
      'username',
      'email',
      'cpf',
      'active',
      'admitted_at',
      'fired_at',
      'updated_by',
      'permissions',
      'roles',
    ]);

    const user = await User.findOrFail(params.id);
    user.merge(data);

    const password = request.input('password');
    if (password) {
      user.password = password;
    }

    await user.save();

    if (roles) {
      await user.roles().sync(roles);
    }

    if (permissions) {
      await user.permissions().sync(permissions);
    }

    await user.loadMany(['roles', 'permissions']);

    return user;
  }

  async destroy({ params }) {
    const user = await User.findOrFail(params.id);
    await user.delete();
  }
}

module.exports = UserController;
