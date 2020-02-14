const { rule } = use('Validator');
const Antl = use('Antl');

class Position {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      description: [rule('required'), rule('unique_combination', ['positions', 'company_id'])],
      company_id: [rule('exists', ['companies', 'id'])],
      created_by: [rule('exists', ['users', 'id'])],
      updated_by: [rule('exists', ['users', 'id'])],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = Position;
