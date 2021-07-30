/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

const Redis = use('Redis');

class UserController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }

    if (searchSentence) {
      return User.query()
        .select(['id', 'registry', 'email', 'active', 'name', 'department_id', 'position_id'])
        .where(searchBy, 'like', `%${searchSentence}%`)
        .with('departments', (builder) => {
          builder.select(['id', 'name', 'level']);
        })
        .with('positions', (builder) => {
          builder.select(['id', 'path_id', 'position_code', 'description']);
        })
        .orderBy(searchBy, 'asc')
        .paginate(page, itemsPerPage);
    }

    return User.query()
      .select(['id', 'registry', 'email', 'active', 'name', 'department_id', 'position_id'])
      .with('departments', (builder) => {
        builder.select(['id', 'name', 'level']);
      })
      .with('positions', (builder) => {
        builder.select(['id', 'path_id', 'position_code', 'description']);
      })
      .orderBy('name', 'asc')
      .paginate(page, itemsPerPage);
  }

  async show({ params }) {
    const user = await User.findOrFail(params.id);
    await user.load('companies', (builder) => {
      builder.select(['code', 'id', 'name']);
    });
    await user.load('departments', (builder) => {
      builder.select(['id', 'name', 'level']);
    });
    await user.load('positions', (builder) => {
      builder.select(['id', 'path_id', 'position_code', 'description']);
    });
    await user.load('roles', (builder) => {
      builder.select(['id', 'name', 'slug']);
    });
    await user.load('permissions');

    const { avatar, avatar_url, created_at, deleted_at, password, password_updated_at, updated_at, user_group_id, ...userData } =
      await user.toJSON();

    return userData;
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

    await Redis.del('departments');

    return user;
  }

  async destroy({ params }) {
    const user = await User.findOrFail(params.id);
    await user.delete();
  }
}

module.exports = UserController;
