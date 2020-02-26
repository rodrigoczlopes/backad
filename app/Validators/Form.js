const { rule } = use('Validator');
const Antl = use('Antl');

class Form {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      name: [rule('required'), rule('unique_combination', ['forms', 'company_id', 'path_id'])],
      company_id: [rule('exists', ['companies', 'id'])],
      path_id: [rule('exists', ['paths', 'id'])],
      created_by: [rule('exists', ['users', 'id'])],
      updated_by: [rule('exists', ['users', 'id'])],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = Form;
