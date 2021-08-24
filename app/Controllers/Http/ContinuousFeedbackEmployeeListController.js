/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class ContinuousFeedbackEmployeeListController {
  async show({ params, response }) {
    try {
      const employeeContinuousFeedback = await User.query()
        .where({ id: params.id })
        .select('id', 'name', 'admitted_at', 'position_id', 'hierarchy_id', 'department_id')
        .first();

      await employeeContinuousFeedback.loadMany({
        continuousFeedbacks: (continuousFeedback) =>
          continuousFeedback
            .select(['id', 'employee_id', 'category', 'description', 'visible_to_employee', 'created_at', 'employee_confirmed'])
            .where({ visible_to_employee: true })
            .whereNot({ employee_confirmed: null })
            .with('continuousFeedbackDevelopmentPlans', (builder) =>
              builder.select([
                'id',
                'continuous_feedback_id',
                'employee_id',
                'leader_id',
                'action',
                'initial_date',
                'final_date',
                'fake_id',
              ])
            )
            .orderBy('created_at', 'desc'),
        positions: (position) =>
          position.select(['id', 'description', 'path_id']).with('paths', (path) => path.select(['id', 'description'])),
        hierarchies: (hierarchy) => hierarchy.select(['id', 'description', 'level']),
        departments: (department) => department.select(['id', 'name']),
      });

      return employeeContinuousFeedback;
    } catch (err) {
      return response.status(500).json({ message: err.message });
    }
  }
}

module.exports = ContinuousFeedbackEmployeeListController;
