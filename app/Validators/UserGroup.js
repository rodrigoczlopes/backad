const { rule } = use('Validator');
const Antl = use('Antl');

class UserGroup {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      name: [rule('required'), rule('unique', ['user_groups'])],
      description: [rule('required')],
      company_id: [rule('exists', ['companies', 'id'])],
      created_by: [rule('exists', ['users', 'id'])],
      updated_by: [rule('exists', ['users', 'id'])],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = UserGroup;
