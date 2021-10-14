const fixName = require('../../functions/toCamelCase');

const Mail = use('Mail');

class NewPasswordMail {
  static get concurrency() {
    return 1;
  }

  static get key() {
    return 'NewPasswordMail-job';
  }

  async handle({ data }) {
    const { email, name, username, password } = data;
    try {
      await Mail.send(['emails.resetpassword'], { email, name, username, password }, (message) => {
        message
          .to(email)
          .from('avaliacao.desempenho@unimedvarginha.coop.br', 'Recursos Humanos | Unimed Varginha')
          .subject(`Senha de acesso ao sistema - ${fixName.toCamelCase(name)}`);
      }).catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = NewPasswordMail;
