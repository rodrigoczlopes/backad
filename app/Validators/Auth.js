const { rule } = use('Validator');
const Antl = use('Antl');

class Auth {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      username: [rule('required')],
      password: [rule('required')],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = Auth;
