/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Position = use('App/Models/Position');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Form = use('App/Models/Form');

class PathFormController {
  async show({ params }) {
    const position = await Position.find(params.id);
    const form = await Form.findBy('path_id', position.path_id);
    if (form) {
      form.loadMany({ behaviorForms: null });
    }
    return form;
  }
}

module.exports = PathFormController;
