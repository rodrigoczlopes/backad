const { parseISO, isBefore, subHours } = require('date-fns');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

const Mail = use('Mail');
const Env = use('Env');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use('App/Models/Token');

class AuthController {
  async register({ request }) {
    const data = request.only('email', 'password', 'username');
    const user = await User.create(data);
    return user;
  }

  async authenticate({ request, auth }) {
    const { username, password } = request.all();
    const { token } = await auth.attempt(username, password);
    return { token };
  }

  async forgot({ request }) {
    const username = request.input('username');

    const user = await User.findByOrFail('username', username);

    const random = await promisify(randomBytes)(24);
    const token = random.toString('hex');
    const resetPasswordUrl = `${Env.get('FRONT_URL')}/reset?token=${token}`;

    await user.tokens().create({
      token,
      type: 'forgotpassword',
    });

    await Mail.send(
      'emails.forgotpassword',
      { name: user.name, resetPasswordUrl },
      message => {
        message
          .to(user.email)
          .from('Crescer - Unimed Vargnha<naoresponda@unimedvarginha.coop.br>')
          .subject('Crescer - Recuperação de senha');
      }
    );
  }

  async reset({ request, response }) {
    const { token, password } = request.only(['token', 'password']);

    const userToken = await Token.findByOrFail('token', token);
    if (isBefore(parseISO(userToken.created_at), subHours(new Date(), 2))) {
      return response
        .status(400)
        .json({ error: 'Invalid date range, please try again' });
    }

    const user = await userToken.user().fetch();
    user.password = password;
    await user.save();
  }
}

module.exports = AuthController;
