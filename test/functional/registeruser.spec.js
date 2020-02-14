const { test, trait } = use('Test/Suite')('Register User');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should register new user', async ({ assert, client }) => {
  const userGroup = await Factory.model('App/Models/UserGroup').create();
  const company = await Factory.model('App/Models/Company').create();
  const userPayload = {
    registry: '0145',
    username: '50.0145',
    name: 'Mateus Cabral da Silva',
    email: 'mateus.silva@unimedvarginha.coop.br',
    cpf: '063.602.086-01',
    user_group_id: userGroup.id,
    company_id: company.id,
  };

  const loggedUser = await Factory.model('App/Models/User').create();
  let user = await Factory.model('App/Models/User').make(userPayload);
  user = user.toJSON();
  delete user.avatar_url; // Deleting this field because when make toJSON on upper row this field is auto generated
  const response = await client
    .post('/register')
    .loginVia(loggedUser, 'jwt')
    .send(user)
    .end();
  response.assertStatus(201);
  assert.exists(response.body.id);
});

test('it should user be unique', async ({ client }) => {
  const userGroup = await Factory.model('App/Models/UserGroup').create();
  const company = await Factory.model('App/Models/Company').create();

  const userPayload = {
    registry: '0145',
    username: '50.0145',
    name: 'Mateus Cabral da Silva',
    email: 'mateus.silva@unimedvarginha.coop.br',
    cpf: '063.602.086-01',
    user_group_id: userGroup.id,
    company_id: company.id,
  };

  const loggedUser = await Factory.model('App/Models/User').create();
  let user = await Factory.model('App/Models/User').make(userPayload);
  user = user.toJSON();
  delete user.avatar_url; // Deleting this field because when make toJSON on upper row this field is auto generated

  const response = await client
    .post('/register')
    .loginVia(loggedUser, 'jwt')
    .send(user)
    .end();

  let userDuplicate = await Factory.model('App/Models/User').make(userPayload);
  userDuplicate = userDuplicate.toJSON();
  delete userDuplicate.avatar_url; // Deleting this field because when make toJSON on upper row this field is auto generated

  const responseDuplicate = await client
    .post('/register')
    .loginVia(loggedUser, 'jwt')
    .send(userDuplicate)
    .end();

  response.assertStatus(201);
  responseDuplicate.assertStatus(400);
});
