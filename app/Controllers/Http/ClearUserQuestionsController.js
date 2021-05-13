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
    const { id: evaluationCycleId } = await EvaluationCycle.query().where().last();

    const employeeAnswer = await EvaluationCycleAnswers.query()
      .where('employee_id', employeeId)
      .where('evaluation_cycle_id', evaluationCycleId)
      .fetch();

    employeeAnswer.toJSON().forEach(async (answer) => {
      const employeeAnswerToDelete = await EvaluationCycleAnswers.find(answer.id);
      await employeeAnswerToDelete.delete();
    });

    const employeeJustificative = await EvaluationCycleJustificative.query()
      .where('employee_id', employeeId)
      .where('evaluation_cycle_id', evaluationCycleId)
      .fetch();

    employeeJustificative.toJSON().forEach(async (justificative) => {
      const employeeJustificativeToDelete = await EvaluationCycleJustificative.find(justificative.id);
      await employeeJustificativeToDelete.delete();
    });

    const employeeComment = await EvaluationCycleComment.query()
      .where('employee_id', employeeId)
      .where('evaluation_cycle_id', evaluationCycleId)
      .fetch();

    employeeComment.toJSON().forEach(async (comment) => {
      const employeeCommentToDelete = await EvaluationCycleComment.find(comment.id);
      await employeeCommentToDelete.delete();
    });
  }
}

module.exports = ClearUserQuestionsController;
