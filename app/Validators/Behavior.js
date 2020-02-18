const { rule } = use('Validator');
const Antl = use('Antl');

class Behavior {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      description: [rule('required')],
      path_id: [
        rule('required'),
        rule('exists', ['paths', 'id']),
        rule('unique_combination', ['behaviors', 'skill_id', 'company_id']),
      ],
      skill_id: [
        rule('required'),
        rule('exists', ['skills', 'id']),
        rule('unique_combination', ['behaviors', 'path_id', 'company_id']),
      ],
      company_id: [rule('exists', ['companies', 'id'])],
      created_by: [rule('exists', ['users', 'id'])],
      updated_by: [rule('exists', ['users', 'id'])],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = Behavior;
