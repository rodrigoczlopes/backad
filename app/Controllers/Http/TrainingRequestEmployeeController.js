/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const TrainingRequestEmployee = use('App/Models/TrainingRequestEmployee');

class TrainingRequestEmployeeController {
  async index() {
    return TrainingRequestEmployee.query()
      .with('createdBy', (builder) => {
        builder.select(['id', 'name', 'email', 'avatar']);
      })
      .fetch();
  }

  async show({ params }) {
    const trainingRequestEmployee = await TrainingRequestEmployee.find(params.id);
    await trainingRequestEmployee.loadMany({ createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']) });
    return trainingRequestEmployee;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const trainingRequestEmployee = await TrainingRequestEmployee.create({ ...data, created_by: auth.user.id });
    return response.status(201).json(trainingRequestEmployee);
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
    const trainingRequestEmployee = await TrainingRequestEmployee.find(params.id);
    trainingRequestEmployee.merge({ ...data, updated_by: auth.user.id });
    await trainingRequestEmployee.save();
    return trainingRequestEmployee;
  }

  async destroy({ params }) {
    const trainingRequestEmployee = await TrainingRequestEmployee.find(params.id);

    await trainingRequestEmployee.delete();
  }
}

module.exports = TrainingRequestEmployeeController;
