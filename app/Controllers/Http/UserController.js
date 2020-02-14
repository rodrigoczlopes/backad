/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
const Helpers = use('Helpers');

class UserController {
  async index() {
    const users = await User.query()
      .with('userGroups')
      .fetch();
    return users;
  }

  async show({ params }) {
    const user = await User.find(params.id);
    await user.load('userGroups');
    return user;
  }

  async update({ params, request }) {
    const data = request.only([
      'name',
      'user_group_id',
      'company_id',
      'registry',
      'username',
      'email',
      'cpf',
      'active',
      'admitted_at',
      'fired_at',
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