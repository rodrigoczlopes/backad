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
        const evaluationCyclesSearched = await EvaluationCycle.query()
          .where(searchBy, 'ilike', `%${searchSentence}%`)
          .orderBy(searchBy)
          .paginate(page, itemsPerPage);
        return evaluationCyclesSearched;
      }

      const evaluationCycles = await EvaluationCycle.query()
        .with('createdBy', (builder) => {
          builder.select(['id', 'name', 'email', 'avatar']);
        })
        .orderBy('description')
        .paginate(page, itemsPerPage);
      return evaluationCycles;
    }

    const evaluationCycle = await EvaluationCycle.query()
      .where({ company_id })
      .where('initial_evaluation_period', '<=', new Date())
      .where('final_evaluation_period', '>=', new Date())
      .select('id', 'company_id')
      .first();
    return evaluationCycle;
  }

  async store({ request, response, auth }) {
    const data = request.all();
    const { department_hierarchies } = data;
    delete data.department_hierarchies;
    delete data.companies;
    const evaluationCycle = await EvaluationCycle.create({ ...data, created_by: auth.user.id });

    const evaluationCycleAreas = department_hierarchies.map((department) => ({
      evaluation_cycle_id: evaluationCycle.id,
      department_id: department,
    }));

    await EvaluationCycleArea.createMany(evaluationCycleAreas);
    const evaluationCycleReturn = await this.show({ params: { id: evaluationCycle.id } });
    return response.status(201).json(evaluationCycleReturn);
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
    const data = request.all();
    const { department_hierarchies } = data;
    delete data.department_hierarchies;
    delete data.companies;
    delete data.id;

    const evaluationCycle = await EvaluationCycle.find(params.id);
    evaluationCycle.merge({ ...data, updated_by: auth.user.id });
    await evaluationCycle.save();

    await EvaluationCycleArea.query().where({ evaluation_cycle_id: evaluationCycle.id }).delete();
    const evaluationCycleAreas = department_hierarchies.map((department) => ({
      evaluation_cycle_id: evaluationCycle.id,
      department_id: department,
    }));

    await EvaluationCycleArea.createMany(evaluationCycleAreas);
    const evaluationCycleReturn = await this.show({ params: { id: evaluationCycle.id } });

    return response.status(200).json(evaluationCycleReturn);
  }

  async destroy({ params }) {
    await EvaluationCycleArea.query().where({ evaluation_cycle_id: params.id }).delete();
    const evaluationCycle = await EvaluationCycle.find(params.id);

    await evaluationCycle.delete();
  }
}

module.exports = EvaluationCycleController;
