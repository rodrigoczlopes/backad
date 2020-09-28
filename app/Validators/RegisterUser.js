const { rule } = use('Validator');
const Antl = use('Antl');

class RegisterUser {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      registry: [rule('required')],
      username: [rule('required'), rule('unique_combination', ['users', 'company_id'])],
      user_access_profile: [rule('required')],
      company_id: [rule('exists', ['companies', 'id'])],
      name: [rule('required')],
      email: [rule('required'), rule('email')],
      password: [rule('required')],
      cpf: [rule('required'), rule('unique', 'users')],
      admitted_at: [rule('required'), rule('date')],
      fired_at: [rule('date')],
      deleted_at: [rule('date')],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = RegisterUser;
