/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Department = use('App/Models/Department');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Hierarchy = use('App/Models/Hierarchy');

class ContinuousFeedbackController {
  async index({ auth }) {}
}

module.exports = ContinuousFeedbackController;
