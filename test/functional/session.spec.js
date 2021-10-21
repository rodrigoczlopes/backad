const { test, trait } = use('Test/Suite')('Session');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('DatabaseTransactions');

const makeSession = async () => {
  const sessionPayload = {
    username: '50.0145',
    password: '123456',
  };

  const session = await Factory.model('App/Models/User').create(sessionPayload);
  return { sessionPayload, session };
};

test('it should return JWT token when session created', async ({ assert, client }) => {
  const { sessionPayload } = await makeSession();
  await Factory.model('App/Models/User').create(sessionPayload);

  const response = await client.post('/authenticate').send(sessionPayload).end();

  response.assertStatus(200);

  assert.exists(response.body.token);
});

test('it should not allow login with incorrect data', async ({ client }) => {
  const { sessionPayload } = await makeSession();
  await Factory.model('App/Models/User').create(sessionPayload);
  const response = await client.post('/authenticate').send({ username: '50.0145', password: '654321' }).end();

  response.assertStatus(401);
});
