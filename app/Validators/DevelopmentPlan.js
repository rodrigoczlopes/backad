const { rule } = use('Validator');
const Antl = use('Antl');

class DevelopmentPlan {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      name: [rule('required'), rule('unique_combination', ['development_plans', 'company_id'])],
      description: [rule('required')],
      company_id: [rule('exists', ['companies', 'id'])],
      created_by: [rule('exists', ['users', 'id'])],
      updated_by: [rule('exists', ['users', 'id'])],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = DevelopmentPlan;
