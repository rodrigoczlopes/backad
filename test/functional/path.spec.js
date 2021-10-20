const { test, trait } = use('Test/Suite')('Path');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Path = use('App/Models/Path');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

const makePath = async () => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const path = {
    description: 'Administrativo',
    company_id: company.id,
    created_by: user.id,
  };
  const pathMock = await Factory.model('App/Models/Path').make(path);

  return { user, company, path, pathMock };
};

test('it should be able to create path', async ({ client }) => {
  const { user, path } = await makePath();
  const response = await client.post('/paths').loginVia(user, 'jwt').send(path).end();
  response.assertStatus(201);
});

test('it cannot be able to register a duplicate path', async ({ client }) => {
  const { user, path: pathMock } = await makePath();
  const path = await Factory.model('App/Models/Path').make(pathMock);

  const pathDuplicated = await Factory.model('App/Models/Path').make(pathMock);

  const response = await client.post('/paths').loginVia(user, 'jwt').send(path.toJSON()).end();

  response.assertStatus(201);

  const responseDuplicate = await client.post('/paths').loginVia(user, 'jwt').send(pathDuplicated.toJSON()).end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list paths', async ({ assert, client }) => {
  const { user, pathMock, company } = await makePath();

  await company.paths().save(pathMock);

  const response = await client.get('/paths').loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body[0].description, pathMock.description);
  assert.equal(response.body[0].createdBy.id, user.id);
  assert.equal(response.body[0].companies.name, company.name);
});

test('it should be able to show single path', async ({ assert, client }) => {
  const { user, pathMock, company } = await makePath();

  await company.paths().save(pathMock);

  const response = await client.get(`/paths/${pathMock.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body.description, pathMock.description);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, company.name);
});

test('it should be able to update path', async ({ assert, client }) => {
  const { user, pathMock, company } = await makePath();

  await company.paths().save(pathMock);

  const response = await client
    .put(`/paths/${pathMock.id}`)
    .loginVia(user, 'jwt')
    .send({ ...pathMock.toJSON(), description: 'Gestão' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.description, 'Gestão');
});

test('it should not be able to update path with an existing description', async ({ client }) => {
  const { user, pathMock, company } = await makePath();

  await company.paths().save(pathMock);

  const path = await Factory.model('App/Models/Path').create({
    description: 'Gestão',
    company_id: company.id,
    created_by: user.id,
  });

  const response = await client
    .put(`/paths/${path.id}`)
    .loginVia(user, 'jwt')
    .send({ ...path.toJSON(), description: 'Administrativo' })
    .end();

  response.assertStatus(400);
});

test('it should be able to delete path', async ({ assert, client }) => {
  const { user, pathMock, company } = await makePath();

  await company.paths().save(pathMock);

  const response = await client.delete(`/paths/${pathMock.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(204);
  const checkPath = await Path.find(pathMock.id);
  assert.isNull(checkPath);
});
