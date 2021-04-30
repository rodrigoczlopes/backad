/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleAnswers = use('App/Models/EvaluationCycleAnswer');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleJustificative = use('App/Models/EvaluationCycleJustificative');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleComment = use('App/Models/EvaluationCycleComment');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycle = use('App/Models/EvaluationCycle');

class ClearUserQuestionsController {
  async destroy({ params }) {
    const { id: employeeId } = await User.find(params.id);
    const { id: evaluationCycleId } = await EvaluationCycle.query().last();

    console.log(employeeId, evaluationCycleId);

    // const employeeAnswer = await EvaluationCycleAnswers.query()
    //   .where('employee_id', employeeId)
    //   .where('evaluation_cycle_id', evaluationCycleId);
    // await employeeAnswer.delete();

    // const employeeJustificative = await EvaluationCycleJustificative.query()
    //   .where('employee_id', employeeId)
    //   .where('evaluation_cycle_id', evaluationCycleId);
    // await employeeJustificative.delete();

    // const employeeComment = await EvaluationCycleComment.query()
    //   .where('employee_id', employeeId)
    //   .where('evaluation_cycle_id', evaluationCycleId);
    // await employeeComment.delete();
  }
}

module.exports = ClearUserQuestionsController;
