/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const UserAccessProfile = use('App/Models/UserAccessProfile');

class UserAccessProfileController {
  async index({ request, response, view }) {}

  async store({ request, response, auth }) {
    const data = request.all();
    console.log(data.profiles);
    data.profiles.forEach((profile) => {
      UserAccessProfile.create({ ...profile, created_by: auth.user.id });
    });
    return response.status(201).json({ message: 'ok' });
  }

  async show({ params, request, response, view }) {}

  async update({ params, request, response }) {}

  async destroy({ params, request, response }) {}
}

module.exports = UserAccessProfileController;
