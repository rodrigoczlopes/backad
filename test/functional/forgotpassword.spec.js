const { test, trait } = use('Test/Suite')('Forgot Password');

const { subHours, subMinutes, format } = require('date-fns');

const Mail = use('Mail');
const Hash = use('Hash');
const Database = use('Database');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should send an email with reset password instructions', async ({ assert, client }) => {
  Mail.fake();

  const forgotPayload = {
    username: '50.0145',
    email: 'mateus.silva@unimedvarginha.coop.br',
  };

  const user = await Factory.model('App/Models/User').create(forgotPayload);

  await client
    .post('/forgot')
    .send(forgotPayload)
    .end();

  const recentEmail = Mail.pullRecent();

  const token = await user.tokens().first();

  assert.equal(recentEmail.message.to[0].address, forgotPayload.email);

  assert.include(token.toJSON(), {
    type: 'forgotpassword',
  });

  Mail.restore();
});

test('it should be able to reset password', async ({ assert, client }) => {
  const forgotPayload = {
    username: '50.0145',
    email: 'mateus.silva@unimedvarginha.coop.br',
  };

  const user = await Factory.model('App/Models/User').create(forgotPayload);
  const userToken = await Factory.model('App/Models/Token').make();
  await user.tokens().save(userToken);

  await client
    .post('/reset')
    .send({
      token: userToken.token,
      password: '123456',
      password_confirmation: '123456',
    })
    .end();

  await user.reload();
  const checkPassword = await Hash.verify('123456', user.password);
  assert.isTrue(checkPassword);
});

test('it cannot reset password after 2h of forgot password request', async ({ client }) => {
  const forgotPayload = {
    username: '50.0145',
    email: 'mateus.silva@unimedvarginha.coop.br',
  };

  const user = await Factory.model('App/Models/User').create(forgotPayload);
  const userToken = await Factory.model('App/Models/Token').make();

  await user.tokens().save(userToken);

  const dateWithSub = format(subMinutes(subHours(new Date(), 2), 10), 'yyyy-MM-dd HH:ii:ss');
  await Database.table('tokens')
    .where('token', userToken.token)
    .update('created_at', dateWithSub);

  await userToken.reload();

  const response = await client
    .post('/reset')
    .send({
      token: userToken.token,
      password: '123456',
      password_confirmation: '123456',
    })
    .end();

  response.assertStatus(400);
});
