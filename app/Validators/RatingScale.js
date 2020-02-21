const { rule } = use('Validator');
const Antl = use('Antl');

class RatingScale {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      name: [rule('required'), rule('unique_combination', ['rating_scales', 'company_id'])],
      company_id: [rule('exists', ['companies', 'id'])],
      created_by: [rule('exists', ['users', 'id'])],
      updated_by: [rule('exists', ['users', 'id'])],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = RatingScale;
