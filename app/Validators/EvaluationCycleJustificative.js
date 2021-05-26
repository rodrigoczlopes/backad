const { rule } = use('Validator');
const Antl = use('Antl');

class EvaluationCycleJustificative {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      user_justificative: [rule('required')],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = EvaluationCycleJustificative;
