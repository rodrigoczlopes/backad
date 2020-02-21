const { rule } = use('Validator');
const Antl = use('Antl');

class EvaluationCycleLevel {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      evaluation_cycle_id: [
        rule('required'),
        rule('unique_combination', ['evaluation_cycle_levels', 'hierarchy_id']),
        rule('exists', ['evaluation_cycles', 'id']),
      ],
      hierarchy_id: [
        rule('required'),
        rule('unique_combination', ['evaluation_cycle_levels', 'evaluation_cycle_id']),
        rule('exists', ['hierarchies', 'id']),
      ],
      created_by: [rule('exists', ['users', 'id'])],
      updated_by: [rule('exists', ['users', 'id'])],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = EvaluationCycleLevel;
