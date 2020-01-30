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
      registry: [rule('required')],
      username: [rule('required')],
      email: [rule('required'), rule('email')],
      password: [rule('required'), rule('confirmed')],
      cpf: [rule('required')],
      active: [rule('bool')],
      admitted_at: [rule('required'), rule('date')],
      fire_at: [rule('date')],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = User;
