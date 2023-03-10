const { rule } = use('Validator');
const Antl = use('Antl');

class Department {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      name: [rule('required'), rule('unique_combination', ['departments', 'company_id'])],
      area_code: [rule('integer')],
      company_id: [rule('exists', ['companies', 'id'])],
      created_by: [rule('exists', ['users', 'id'])],
      updated_by: [rule('exists', ['users', 'id'])],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = Department;
