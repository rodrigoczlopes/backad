const { rule } = use('Validator');
const Antl = use('Antl');

class EvaluationCycle {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      description: [rule('required'), rule('unique_combination', ['evaluation_cycles', 'company_id'])],
      initial_evaluation_period: [rule('required')],
      final_evaluation_period: [rule('required')],
      initial_manager_feedback: [rule('required')],
      final_manager_feedback: [rule('required')],
      quantity_pair: [rule('required')],
      quantity_subordinate: [rule('required')],
      quantity_manager: [rule('required')],
      company_id: [rule('exists', ['companies', 'id'])],
      created_by: [rule('exists', ['users', 'id'])],
      updated_by: [rule('exists', ['users', 'id'])],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = EvaluationCycle;
