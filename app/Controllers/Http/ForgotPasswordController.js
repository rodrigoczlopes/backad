const { randomBytes } = require('crypto');
const { promisify } = require('util');

const Mail = use('Mail');
const Env = use('Env');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class ForgotPasswordController {
  async store({ request }) {
    const username = request.input('username');

    const user = await User.findByOrFail('username', username);

    const random = await promisify(randomBytes)(24);
    const token = random.toString('hex');
    const resetPasswordUrl = `${Env.get('FRONT_URL')}/reset?token=${token}`;

    await user.tokens().create({
      token,
      type: 'forgotpassword',
    });

    await Mail.send('emails.forgotpassword', { name: user.name, resetPasswordUrl }, message => {
      message
        .to(user.email)
        .from('Crescer - Unimed Vargnha<naoresponda@unimedvarginha.coop.br>')
        .subject('Crescer - Recuperação de senha');
    });
  }
}

module.exports = ForgotPasswordController;
