/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const UserGroup = use('App/Models/UserGroup');

const Redis = use('Redis');

class UserGroupController {
  async index({ request }) {
    const { page, itemsPerPage } = request.get();
    if (!page) {
      const cachedUserGroups = await Redis.get('usergroups');
      if (cachedUserGroups) {
        return JSON.parse(cachedUserGroups);
      }

      const allUserGroups = await UserGroup.query()
        .with('createdBy', (builder) => {
          builder.select(['id', 'name', 'email', 'avatar']);
        })
        .fetch();

      await Redis.set('usergroups', JSON.stringify(allUserGroups));
      return allUserGroups;
    }

    return UserGroup.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .paginate(page, itemsPerPage);
  }

  async show({ params }) {
    const userGroup = await UserGroup.find(params.id);
    await userGroup.load('createdBy', (builder) => {
      builder.select(['id', 'name', 'email', 'avatar']);
    });
    return userGroup;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const usergroup = await UserGroup.create({ ...data, created_by: auth.user.id });
    return response.status(201).json(usergroup);
  }

  async update({ params, request, auth }) {
    const data = request.only(['name', 'description', 'color', 'company_id', 'updated_by']);
    const userGroup = await UserGroup.find(params.id);
    userGroup.merge({ ...data, updated_by: auth.user.id });
    await userGroup.save();
    return userGroup;
  }

  async destroy({ params }) {
    const userGroup = await UserGroup.find(params.id);

    await userGroup.delete();
  }
}

module.exports = UserGroupController;
