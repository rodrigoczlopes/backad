/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Position = use('App/Models/Position');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Form = use('App/Models/Form');

class PathFormController {
  async show({ params, auth }) {
    const position = await Position.find(params.id);
    const form = await Form.query()
      .where('path_id', position.path_id)
      .where('company_id', auth.user.company_id)
      .with('behaviorForms')
      .first();
    return form;
  }
}

module.exports = PathFormController;
