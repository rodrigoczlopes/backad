const { test, trait } = use('Test/Suite')('Hierarchy');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Hierarchy = use('App/Models/Hierarchy');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create hierarchy', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const response = await client
    .post('/hierarchies')
    .loginVia(user, 'jwt')
    .send({
      description: 'Superintendente',
      level: '01',
      active: true,
      company_id: company.id,
      created_by: user.id,
    })
    .end();

  response.assertStatus(201);
});

test('it cannot be able to register a duplicate hierarchy', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const hierarchy = await Factory.model('App/Models/Hierarchy').make({
    description: 'Superintendente',
    level: '01',
    active: true,
    company_id: company.id,
    created_by: user.id,
  });

  const hierarchyDuplicated = await Factory.model('App/Models/Hierarchy').make({
    description: 'Superintendente',
    level: '01',
    active: true,
    company_id: company.id,
    created_by: user.id,
  });

  const response = await client
    .post('/hierarchies')
    .loginVia(user, 'jwt')
    .send(hierarchy.toJSON())
    .end();

  response.assertStatus(201);

  const responseDuplicate = await client
    .post('/hierarchies')
    .loginVia(user, 'jwt')
    .send(hierarchyDuplicated.toJSON())
    .end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list hierarchies', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const hierarchy = await Factory.model('App/Models/Hierarchy').make({ company_id: company.id, created_by: user.id });

  await company.hierarchies().save(hierarchy);

  const response = await client
    .get('/hierarchies')
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body[0].description, hierarchy.description);
  assert.equal(response.body[0].createdBy.id, user.id);
  assert.equal(response.body[0].companies.name, 'OrangeDev');
});

test('it should be able to show single hierarchy', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const hierarchy = await Factory.model('App/Models/Hierarchy').make({ company_id: company.id, created_by: user.id });

  await company.hierarchies().save(hierarchy);

  const response = await client
    .get(`/hierarchies/${hierarchy.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body.description, hierarchy.description);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, 'OrangeDev');
});

test('it should be able to update hierarchy', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const hierarchy = await Factory.model('App/Models/Hierarchy').make({ company_id: company.id, created_by: user.id });

  await company.paths().save(hierarchy);

  const response = await client
    .put(`/hierarchies/${hierarchy.id}`)
    .loginVia(user, 'jwt')
    .send({ ...hierarchy.toJSON(), description: 'Gerente' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.description, 'Gerente');
});

test('it should not be able to update hierarchy with an existing description', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  await Factory.model('App/Models/Hierarchy').create({ description: 'Gerente', company_id: company.id, created_by: user.id });
  const hierarchy = await Factory.model('App/Models/Hierarchy').create({
    description: 'Superintendente',
    level: '01',
    active: true,
    company_id: company.id,
    created_by: user.id,
  });

  const response = await client
    .put(`/hierarchies/${hierarchy.id}`)
    .loginVia(user, 'jwt')
    .send({ ...hierarchy.toJSON(), description: 'Gerente' })
    .end();

  response.assertStatus(400);
});

test('it should be able to delete hierarchy', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const hierarchy = await Factory.model('App/Models/Hierarchy').make({ company_id: company.id, created_by: user.id });

  await company.hierarchies().save(hierarchy);

  const response = await client
    .delete(`/hierarchies/${hierarchy.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
  const checkHierarchy = await Hierarchy.find(hierarchy.id);
  assert.isNull(checkHierarchy);
});
