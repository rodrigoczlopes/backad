const { test, trait } = use('Test/Suite')('Position');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Position = use('App/Models/Position');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create position', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ created_by: user.id });
  const response = await client
    .post('/positions')
    .loginVia(user, 'jwt')
    .send({
      description: 'Analista de Sistemas',
      position_code: 123,
      path_id: path.id,
      company_id: company.id,
      created_by: user.id,
    })
    .end();

  response.assertStatus(201);
});

test('it should not be able to register a duplicate position', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ company_id: company.id, created_by: user.id });
  const position = await Factory.model('App/Models/Position').make({
    description: 'Analista de Sistemas',
    position_code: 123,
    path_id: path.id,
    company_id: company.id,
    created_by: user.id,
  });

  const positionDuplicated = await Factory.model('App/Models/Position').make({
    description: 'Analista de Sistemas',
    position_code: 123,
    path_id: path.id,
    company_id: company.id,
    created_by: user.id,
  });

  const response = await client
    .post('/positions')
    .loginVia(user, 'jwt')
    .send(position.toJSON())
    .end();

  response.assertStatus(201);

  const responseDuplicate = await client
    .post('/positions')
    .loginVia(user, 'jwt')
    .send(positionDuplicated.toJSON())
    .end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list positions', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const path = await Factory.model('App/Models/Path').make({ company_id: company.id, created_by: user.id });
  const position = await Factory.model('App/Models/Position').make({
    path_id: path.id,
    company_id: company.id,
    created_by: user.id,
  });

  await company.positions().save(position);

  const response = await client
    .get('/positions')
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body[0].description, position.description);
  assert.equal(response.body[0].createdBy.id, user.id);
  assert.equal(response.body[0].companies.name, 'OrangeDev');
});

test('it should be able to show single position', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const path = await Factory.model('App/Models/Path').make({ company_id: company.id, created_by: user.id });
  const position = await Factory.model('App/Models/Position').make({
    path_id: path.id,
    company_id: company.id,
    created_by: user.id,
  });

  await company.positions().save(position);

  const response = await client
    .get(`/positions/${position.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body.description, position.description);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, 'OrangeDev');
});

test('it should be able to update position', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const path = await Factory.model('App/Models/Path').make({ company_id: company.id, created_by: user.id });
  const position = await Factory.model('App/Models/Position').make({
    path_id: path.id,
    company_id: company.id,
    created_by: user.id,
  });

  await company.positions().save(position);

  const response = await client
    .put(`/positions/${position.id}`)
    .loginVia(user, 'jwt')
    .send({ ...position.toJSON(), description: 'Analista de Faturamento', position_code: 456 })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.description, 'Analista de Faturamento');
});

test('it should not be able to update position with an existing description', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ company_id: company.id, created_by: user.id });
  await Factory.model('App/Models/Position').create({
    description: 'Analista de Sistemas',
    company_id: company.id,
    created_by: user.id,
    path_id: path.id,
  });
  const position = await Factory.model('App/Models/Position').create({
    description: 'Analista de Faturamento',
    company_id: company.id,
    created_by: user.id,
    path_id: path.id,
  });

  const response = await client
    .put(`/positions/${position.id}`)
    .loginVia(user, 'jwt')
    .send({ ...position.toJSON(), description: 'Analista de Sistemas' })
    .end();

  response.assertStatus(400);
});

test('it should be able to delete position', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const path = await Factory.model('App/Models/Path').make({ company_id: company.id, created_by: user.id });
  const position = await Factory.model('App/Models/Position').make({
    path_id: path.id,
    company_id: company.id,
    created_by: user.id,
  });

  await company.positions().save(position);

  const response = await client
    .delete(`/positions/${position.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
  const checkPosition = await Position.find(company.id);
  assert.isNull(checkPosition);
});
