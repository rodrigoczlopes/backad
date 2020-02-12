const { rule } = use('Validator');
const Antl = use('Antl');

class Company {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      name: [rule('required')],
      code: [rule('integer'), rule('required')],
      created_by: [rule('exists', ['users', 'id'])],
      updated_by: [rule('exists', ['users', 'id'])],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = Company;
