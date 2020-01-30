const Antl = use('Antl');

class Auth {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      username: 'required',
      password: 'required',
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = Auth;
