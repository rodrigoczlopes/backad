/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycle = use('App/Models/EvaluationCycle');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleArea = use('App/Models/EvaluationCycleArea');

class EvaluationCycleController {
  async index({ request }) {
    let { page, itemsPerPage } = request.get();
    const { searchSentence, searchBy, company_id } = request.get();
    if (!page) {
      page = 1;
      itemsPerPage = 20000;
    }

    if (!company_id) {
      if (searchSentence) {
        return EvaluationCycle.query()
          .where(searchBy, 'like', `%${searchSentence}%`)
          .orderBy(searchBy)
          .paginate(page, itemsPerPage);
      }

      return EvaluationCycle.query()
        .with('createdBy', (builder) => {
          builder.select(['id', 'name', 'email', 'avatar']);
        })
        .orderBy('description')
        .paginate(page, itemsPerPage);
    }

    return EvaluationCycle.query()
      .where({ company_id })
      .where('initial_evaluation_period', '<=', new Date())
      .where('final_evaluation_period', '>=', new Date())
      .select(
        'id',
        'company_id',
        'initial_evaluation_period',
        'final_evaluation_period',
        'initial_manager_feedback',
        'final_manager_feedback',
        'initial_employee_evaluation',
        'final_employee_evaluation',
        'initial_manager_evaluation',
        'final_manager_evaluation'
      )
      .first();
  }

  async store({ request, response, auth }) {
    const allData = request.all();
    const { department_hierarchies, companies, ...data } = allData;

    const evaluationCycle = await EvaluationCycle.create({ ...data, created_by: auth.user.id });

    const evaluationCycleAreas = department_hierarchies.map((department) => ({
      evaluation_cycle_id: evaluationCycle.id,
      department_id: department,
    }));

    await EvaluationCycleArea.createMany(evaluationCycleAreas);

    await evaluationCycle.loadMany(['companies', 'evaluationCycleAreas']);
    return response.status(201).json(evaluationCycle);
  }

  async show({ params }) {
    const evaluationCycle = await EvaluationCycle.find(params.id);
    await evaluationCycle.loadMany({
      createdBy: (builder) => builder.select(['id', 'name', 'email', 'avatar']),
      companies: null,
      evaluationCycleAreas: null,
    });
    return evaluationCycle;
  }

  async update({ params, response, request, auth }) {
    const allData = request.all();
    const { department_hierarchies, companies, id, ...data } = allData;

    const evaluationCycle = await EvaluationCycle.findOrFail(params.id);
    evaluationCycle.merge({ ...data, updated_by: auth.user.id });
    await evaluationCycle.save();

    await EvaluationCycleArea.query().where({ evaluation_cycle_id: evaluationCycle.id }).delete();
    const evaluationCycleAreas = department_hierarchies.map((department) => ({
      evaluation_cycle_id: evaluationCycle.id,
      department_id: department,
    }));

    await EvaluationCycleArea.createMany(evaluationCycleAreas);

    await evaluationCycle.loadMany(['companies', 'evaluationCycleAreas']);

    return response.status(200).json(evaluationCycle);
  }

  async destroy({ params }) {
    await EvaluationCycleArea.query().where({ evaluation_cycle_id: params.id }).delete();
    const evaluationCycle = await EvaluationCycle.find(params.id);

    await evaluationCycle.delete();
  }
}

module.exports = EvaluationCycleController;
