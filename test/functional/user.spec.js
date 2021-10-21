const { test, trait } = use('Test/Suite')('User');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

const Helpers = use('Helpers');
const Hash = use('Hash');
const User = use('App/Models/User');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

const makeUser = async () => {
  const user = {
    name: 'João da Silva',
    registry: '168',
    username: '50.0168',
    password: '123456',
    password_confirmation: '123456',
  };

  const userMock = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: userMock.id });
  const department = await Factory.model('App/Models/Department').create({ company_id: company.id });
  const path = await Factory.model('App/Models/Path').create({ company_id: company.id });
  const position = await Factory.model('App/Models/Position').create({ path_id: path.id, company_id: company.id });
  const hierarchy = await Factory.model('App/Models/Hierarchy').create({ company_id: company.id });

  return { user, userMock, company, department, path, position, hierarchy };
};

test('it should be able to update profile', async ({ assert, client }) => {
  const { userMock } = await makeUser();

  const response = await client
    .put('/profile')
    .loginVia(userMock, 'jwt')
    .field('name', 'João da Silva')
    .field('password', '123456')
    .field('password_confirmation', '123456')
    .attach('avatar', Helpers.tmpPath('test/avatar.jpg'))
    .end();
  response.assertStatus(200);
  assert.equal(response.body.name, 'João da Silva');
  assert.exists(response.body.avatar);

  await userMock.reload();
  assert.isTrue(await Hash.verify('123456', userMock.password));
});

test('it should be able to update user data', async ({ assert, client }) => {
  const { company, department, position, hierarchy } = await makeUser();
  const user = await Factory.model('App/Models/User').create({
    company_id: company.id,
    department_id: department.id,
    position_id: position.id,
    hierarchy_id: hierarchy.id,
  });
  const response = await client
    .put(`/users/${user.id}`)
    .loginVia(user, 'jwt')
    .send({
      ...user.toJSON(),
      name: 'João da Silva',
      registry: '168',
      username: '50.0168',
      password: '123456',
      password_confirmation: '123456',
    })
    .end();
  response.assertStatus(200);
  assert.equal(response.body.name, 'João da Silva');
  assert.equal(response.body.registry, '168');

  await user.reload();
  assert.isTrue(await Hash.verify('123456', user.password));
});

test('it should not be able to update user data with an existing registry', async ({ client }) => {
  const { userMock } = await makeUser();
  const response = await client
    .put(`/users/${userMock.id}`)
    .loginVia(userMock, 'jwt')
    .send({
      ...userMock.toJSON(),
      name: 'João da Silva',
      registry: '168',
      username: '50.0168',
      password: '123456',
      password_confirmation: '123456',
    })
    .end();
  response.assertStatus(400);
});

test('it should be able to list users', async ({ assert, client }) => {
  const { userMock } = await makeUser();
  const response = await client.get('/users').loginVia(userMock, 'jwt').end();

  response.assertStatus(200);
  const { data } = response.body;
  assert.equal(data[0].name, userMock.name);
});

test('it should be able to show single user', async ({ assert, client }) => {
  const { userMock } = await makeUser();
  const response = await client.get(`/users/${userMock.id}`).loginVia(userMock, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body.name, userMock.name);
});

test('it should be able to delete user', async ({ assert, client }) => {
  const { userMock } = await makeUser();
  const response = await client.delete(`/users/${userMock.id}`).loginVia(userMock, 'jwt').end();

  response.assertStatus(204);
  const checkUser = await User.find(userMock.id);
  assert.isNull(checkUser);
});
