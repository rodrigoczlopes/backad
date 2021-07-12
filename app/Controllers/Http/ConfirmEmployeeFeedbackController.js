/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EvaluationCycleComment = use('App/Models/EvaluationCycleComment');

class ConfirmEmployeeFeedbackController {
  async show({ request, response, auth }) {
    const { employee_id, password } = request.all();

    if (!employee_id) return response.status(401).json({ status: false, message: 'Favor informar um id válido' });
    const user = await User.find(employee_id);

    try {
      const { token } = await auth.attempt(user.username, password);
      if (!token) return response.json({ status: false });

      const employeeFeedback = await EvaluationCycleComment.query().where('employee_id', employee_id).fetch();

      employeeFeedback.toJSON().forEach(async (feedback) => {
        const feedbackToEdit = await EvaluationCycleComment.find(feedback.id);
        feedbackToEdit.merge({ employee_receipt_confirmation_date: new Date() });
        feedbackToEdit.save();
      });

      return response.json({ status: true });
    } catch (err) {
      return response.json({ status: false, message: err.message });
    }
  }
}

module.exports = ConfirmEmployeeFeedbackController;
