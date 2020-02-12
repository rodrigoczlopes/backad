const { rule } = use('Validator');
const Antl = use('Antl');

class User {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      name: [rule('required')],
      user_group_id: [rule('exists', ['user_groups', 'id'])],
      company_id: [rule('exists', ['companies', 'id'])],
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
