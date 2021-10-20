const { test, trait } = use('Test/Suite')('User Group');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const UserGroup = use('App/Models/UserGroup');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create user group', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/usergroups')
    .loginVia(user, 'jwt')
    .send({
      name: 'Administrador',
      description: 'Usuário responsável por administrar o sistema',
      created_by: user.id,
    })
    .end();

  response.assertStatus(201);
});

test('it cannot be able to register a duplicate user group', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const userGroup = await Factory.model('App/Models/UserGroup').make({
    name: 'Administrador',
    description: 'Usuário responsável por administrar o sistema',
    created_by: user.id,
    updated_by: user.id,
  });

  const userGroupDuplicated = await Factory.model('App/Models/UserGroup').make({
    name: 'Administrador',
    description: 'Usuário responsável por administrar o sistema',
    created_by: user.id,
    updated_by: user.id,
  });

  const response = await client.post('/usergroups').loginVia(user, 'jwt').send(userGroup.toJSON()).end();

  response.assertStatus(201);

  const responseDuplicate = await client.post('/usergroups').loginVia(user, 'jwt').send(userGroupDuplicated.toJSON()).end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list users groups', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const userGroup = await Factory.model('App/Models/UserGroup').make({ created_by: user.id, updated_by: user.id });

  await user.createGroup().save(userGroup);

  const response = await client.get('/usergroups').loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body[0].name, userGroup.name);
  assert.equal(response.body[0].createdBy.id, user.id);
});

test('it should be able to show single user group', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const userGroup = await Factory.model('App/Models/UserGroup').create({ created_by: user.id, updated_by: user.id });

  await user.createGroup().save(userGroup);

  const response = await client.get(`/usergroups/${userGroup.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body.name, userGroup.name);
  assert.equal(response.body.createdBy.id, user.id);
});

test('it should be able to update user group', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const userGroup = await Factory.model('App/Models/UserGroup').create({ updated_by: user.id });

  await user.createGroup().save(userGroup);

  const response = await client
    .put(`/usergroups/${userGroup.id}`)
    .loginVia(user, 'jwt')
    .send({ ...userGroup.toJSON(), name: 'Funcionario' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.name, 'Funcionario');
});

test('it should be able to delete user group', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const userGroup = await Factory.model('App/Models/UserGroup').create({ updated_by: user.id });

  await user.createGroup().save(userGroup);

  const response = await client.delete(`/usergroups/${userGroup.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(204);
  const checkUserGroup = await UserGroup.find(userGroup.id);
  assert.isNull(checkUserGroup);
});
