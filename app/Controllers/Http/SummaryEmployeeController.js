/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/*
todo:
verificar se o path é igual ao position path por conta de algumas vezes se o colaborador tiver o cargo trocado, ele gera outro
formulário para ele
*/

class SummaryEmployeeController {
  async show({ params }) {
    const { evaluation_cycle_id, employee_id } = params;

    const employees = await User.query()
      .select(['id', 'name', 'department_id', 'email', 'hierarchy_id', 'position_id', 'registry', 'username'])
      .where({ id: employee_id })
      .where({ active: true })
      .with('departments')
      .with('positions', (builder) => {
        builder.with('paths');
      })
      .with('hierarchies')
      .with('evaluationCycleAnswers', (evaluationCycleAnswer) => {
        evaluationCycleAnswer
          .select([
            'id',
            'behavior_id',
            'employee_id',
            'evaluation_cycle_id',
            'form_id',
            'leader_answer',
            'leader_finished',
            'leader_id',
            'user_answer',
            'user_finished',
          ])
          .where({ evaluation_cycle_id })
          .with('behaviors', (behavior) => {
            behavior.select(['id', 'description', 'skill_id', 'path_id']).with('skills', (skill) => {
              skill.select(['id', 'description', 'name']);
            });
          });
      })
      .with('evaluationCycleJustificatives', (builder) => {
        builder.where({ evaluation_cycle_id }).with('skills');
      })
      .with('evaluationCycleComments', (builder) => {
        builder.where({ evaluation_cycle_id }).with('comments');
      })
      .orderBy('name', 'asc')
      .fetch();

    return employees.first();
  }
}

module.exports = SummaryEmployeeController;
