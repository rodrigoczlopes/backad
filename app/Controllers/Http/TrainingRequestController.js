/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const TrainingRequest = use('App/Models/TrainingRequest');

class TrainingRequestController {
  async index() {
    return TrainingRequest.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .with('trainingRequestEmployees')
      .fetch();
  }

  async show({ params }) {
    const trainingRequest = await TrainingRequest.find(params.id);
    await trainingRequest.loadMany({
      createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']),
      trainingRequestEmployees: null,
    });
    return trainingRequest;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const trainingRequest = await TrainingRequest.create({ ...data, created_by: auth.user.id });
    return response.status(201).json(trainingRequest);
  }

  async update({ params, request, auth }) {
    const data = request.only([
      'leader_id',
      'type',
      'category',
      'suggested_institution',
      'expected_outcome',
      'completion_forecast',
      'human_resources_seem',
      'area_id',
      'description',
      'training_id',
      'instructor_type',
    ]);
    const trainingRequest = await TrainingRequest.find(params.id);
    trainingRequest.merge({ ...data, updated_by: auth.user.id });
    await trainingRequest.save();
    return trainingRequest;
  }

  async destroy({ params }) {
    const trainingRequest = await TrainingRequest.find(params.id);
    await trainingRequest.delete();
  }
}

module.exports = TrainingRequestController;
