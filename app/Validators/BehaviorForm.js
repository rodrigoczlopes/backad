const { rule } = use('Validator');
const Antl = use('Antl');

class BehaviorForm {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      form_id: [rule('required'), rule('exists', ['forms', 'id'])],
      behavior_id: [rule('required'), rule('exists', ['behaviors', 'id'])],
      company_id: [rule('exists', ['companies', 'id'])],
      created_by: [rule('exists', ['users', 'id'])],
      updated_by: [rule('exists', ['users', 'id'])],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = BehaviorForm;
