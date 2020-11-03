const Mail = use('Mail');

class NewPasswordMail {
  static get concurrency() {
    return 1;
  }

  static get key() {
    return 'NewPasswordMail-job';
  }

  async handle({ email, name, username, password }) {
    await Mail.send(['emails.resetPassword'], { email, name, username, password }, (message) => {
      message
        .to(email)
        .from('avaliacao.desempenho@unimedvarginha.coop.br', 'Recursos Humanos | Unimed Varginha')
        .subject('Avaliação de Desempenho - Senha de acesso ao sistema');
    });
  }
}

module.exports = NewPasswordMail;
