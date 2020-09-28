const { rule } = use('Validator');
const Antl = use('Antl');

class User {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      name: [rule('required')],
      user_access_profile: [rule('required')],
      company_id: [rule('exists', ['companies', 'id'])],
      department_id: [rule('required'), rule('exists', ['departments', 'id'])],
      position_id: [rule('required'), rule('exists', ['positions', 'id'])],
      hierarchy_id: [rule('required'), rule('exists', ['hierarchies', 'id'])],
      registry: [rule('required'), rule('unique_combination', ['users', 'company_id'])],
      email: [rule('email')],
      password: [rule('confirmed')],
      active: [rule('boolean')],
      admitted_at: [rule('date')],
      fire_at: [rule('date')],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = User;
