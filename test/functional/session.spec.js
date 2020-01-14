const { test, trait } = use('Test/Suite')('Session');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should return JWT token when session created', async ({
  assert,
  client,
}) => {
  const sessionPayload = {
    username: '50.0145',
    password: '123456',
  };
  await Factory.model('App/Models/User').create(sessionPayload);

  const response = await client
    .post('/authenticate')
    .send(sessionPayload)
    .end();

  response.assertStatus(200);
  assert.exists(response.body.token);
});
