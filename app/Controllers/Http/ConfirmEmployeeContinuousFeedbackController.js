/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const ContinuousFeedback = use('App/Models/ContinuousFeedback');

class ConfirmEmployeeContinuousFeedbackController {
  async handle({ request, response, auth }) {
    const { employee_id, password, continuous_feedback_id } = request.all();

    if (!employee_id) return response.status(401).json({ status: false, message: 'Favor informar um id válido' });
    const user = await User.find(employee_id);

    try {
      const { token } = await auth.attempt(user.username, password);
      if (!token) return response.json({ status: false });

      const continuousFeedback = await ContinuousFeedback.find(continuous_feedback_id);
      continuousFeedback.merge({ employee_confirmed: new Date() });
      continuousFeedback.save();

      return response.json({ status: true });
    } catch (err) {
      return response.json({ status: false, message: err.message });
    }
  }
}

module.exports = ConfirmEmployeeContinuousFeedbackController;
