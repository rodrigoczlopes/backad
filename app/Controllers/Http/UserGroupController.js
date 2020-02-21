/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const UserGroup = use('App/Models/UserGroup');

/**
 * Resourceful controller for interacting with usergroups
 */
class UserGroupController {
  async index() {
    const userGroups = await UserGroup.query()
      .with('createdBy', builder => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .fetch();
    return userGroups;
  }

  async show({ params }) {
    const userGroup = await UserGroup.find(params.id);
    await userGroup.load('createdBy', builder => {
      builder.select(['id', 'name', 'email', 'avatar']);
    });
    return userGroup;
  }

  async store({ request, response }) {
    const data = request.all();
    const usergroup = await UserGroup.create(data);
    return response.status(201).json(usergroup);
  }

  async update({ params, request }) {
    const data = request.only(['name', 'description', 'color', 'company_id', 'updated_by']);
    const userGroup = await UserGroup.find(params.id);
    userGroup.merge(data);
    await userGroup.save();
    return userGroup;
  }

  async destroy({ params }) {
    const userGroup = await UserGroup.find(params.id);

    await userGroup.delete();
  }
}

module.exports = UserGroupController;
