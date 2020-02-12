const { test, trait } = use('Test/Suite')('User');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

const Helpers = use('Helpers');
const Hash = use('Hash');
const User = use('App/Models/User');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to update profile', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .put('/profile')
    .loginVia(user, 'jwt')
    .field('name', 'João da Silva')
    .field('password', '123456')
    .field('password_confirmation', '123456')
    .attach('avatar', Helpers.tmpPath('test/avatar.jpg'))
    .end();
  response.assertStatus(200);
  assert.equal(response.body.name, 'João da Silva');
  assert.exists(response.body.avatar);

  await user.reload();
  assert.isTrue(await Hash.verify('123456', user.password));
});

test('it should be able to update user data', async ({ assert, client }) => {
  const userGroup = await Factory.model('App/Models/User').create();
  const user = await Factory.model('App/Models/User').create({ user_group_id: userGroup.id });

  const response = await client
    .put(`/users/${user.id}`)
    .loginVia(user, 'jwt')
    .field('name', 'João da Silva')
    .field('registry', '50.0168')
    .field('password', '123456')
    .field('password_confirmation', '123456')
    .attach('avatar', Helpers.tmpPath('test/avatar.jpg'))
    .end();
  response.assertStatus(200);
  assert.equal(response.body.name, 'João da Silva');
  assert.equal(response.body.registry, '50.0168');

  await user.reload();
  assert.isTrue(await Hash.verify('123456', user.password));
});

test('it should be able to list users', async ({ assert, client }) => {
  const userGroup = await Factory.model('App/Models/UserGroup').create();

  const user = await Factory.model('App/Models/User').create({ user_group_id: userGroup.id });

  const response = await client
    .get('/users')
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);
  assert.equal(response.body[0].name, user.name);
  assert.equal(response.body[0].userGroups.id, user.user_group_id);
});

test('it should be able to show single user', async ({ assert, client }) => {
  const userGroup = await Factory.model('App/Models/UserGroup').create();

  const user = await Factory.model('App/Models/User').create({ user_group_id: userGroup.id });

  const response = await client
    .get(`/users/${user.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body.name, user.name);
  assert.equal(response.body.userGroups.id, user.user_group_id);
});

test('it should be able to delete user', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .delete(`/users/${user.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
  const checkUser = await User.find(user.id);
  assert.isNull(checkUser);
});
