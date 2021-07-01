/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class ConciliationListController {
  async index() {
    return User.query()
      .where({ active: true })
      .with('departments', (builder) => {
        builder.select(['id', 'name']);
      })
      .with('evaluationCycleAnswers')
      .orderBy('name', 'asc')
      .fetch();
  }
}

module.exports = ConciliationListController;
