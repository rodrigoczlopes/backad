const { rule } = use('Validator');
const Antl = use('Antl');

class EvaluationCycleArea {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      evaluation_cycle_id: [
        rule('required'),
        rule('unique_combination', ['evaluation_cycle_areas', 'department_id']),
        rule('exists', ['evaluation_cycles', 'id']),
      ],
      department_id: [
        rule('required'),
        rule('unique_combination', ['evaluation_cycle_areas', 'evaluation_cycle_id']),
        rule('exists', ['departments', 'id']),
      ],
      created_by: [rule('exists', ['users', 'id'])],
      updated_by: [rule('exists', ['users', 'id'])],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = EvaluationCycleArea;
