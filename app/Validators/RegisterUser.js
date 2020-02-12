const Antl = use('Antl');

class RegisterUser {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      registry: 'required',
      username: 'required|unique:users',
      user_group_id: 'required',
      company_id: 'required',
      name: 'required',
      email: 'required|email',
      password: 'required',
      cpf: 'required',
      admitted_at: 'required|date',
      fired_at: 'date',
      deleted_at: 'date',
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = RegisterUser;
