/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const Training = use('App/Models/Training');

class TrainingController {
  async index() {
    return Training.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .orderBy('name')
      .fetch();
  }

  async show({ params }) {
    const training = await Training.find(params.id);
    await training.loadMany({ createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']) });
    return training;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const training = await Training.create({ ...data, created_by: auth.user.id });
    return response.status(201).json(training);
  }

  async update({ params, request, auth }) {
    const data = request.only(['name', 'description', 'in_loco', 'category', 'name', 'objective']);
    const training = await Training.find(params.id);
    training.merge({ ...data, updated_by: auth.user.id });
    await training.save();
    return training;
  }

  async destroy({ params }) {
    const training = await Training.find(params.id);

    await training.delete();
  }
}

module.exports = TrainingController;
