/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
const Helpers = use('Helpers');

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
        .where(searchBy, 'ilike', `%${searchSentence}%`)
        .with('userGroups')
        .with('companies')
        .with('departments')
        .with('positions')
        .with('hierarchies')
        .orderBy(searchBy, 'asc')
        .paginate(page, itemsPerPage);
      return usersList;
    }

    const users = await User.query()
      .with('userGroups')
      .with('companies')
      .with('departments')
      .with('positions')
      .with('hierarchies')
      .orderBy('name', 'asc')
      .paginate(page, itemsPerPage);

    return users;
  }

  async show({ params }) {
    const user = await User.find(params.id);
    await user.load('companies');

    return user;
  }

  async update({ params, request, auth }) {
    const data = request.only([
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
    ]);

    const avatar = request.file('avatar');

    const user = await User.find(params.id);
    if (avatar) {
      await avatar.move(Helpers.tmpPath('uploads'), {
        name: `${new Date().getTime()}.${avatar.subtype}`,
      });

      if (!avatar.moved()) {
        return avatar.error();
      }

      user.avatar = avatar.fileName;
    }
    user.merge(data);

    const password = request.input('password');
    if (password) {
      user.password = password;
    }

    await user.save();
    return user;
  }

  async destroy({ params }) {
    const user = await User.find(params.id);

    await user.delete();
  }
}

module.exports = UserController;
