const { rule } = use('Validator');
const Antl = use('Antl');

class Behavior {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      description: [rule('required')],
      path_id: [rule('exists', ['paths', 'id'])],
      skill_id: [rule('required'), rule('exists', ['skills', 'id'])],
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
