/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class LeaderController {
  async index() {
    const usersList = await User.query()
      .with('hierarchies', (builder) => {
        builder.where('description', '<>', `Administrativo/Operacional`);
      })
      .orderBy('name', 'asc')
      .fetch();

    return usersList;
  }
}

module.exports = LeaderController;
