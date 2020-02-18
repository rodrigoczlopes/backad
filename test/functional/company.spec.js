const { test, trait } = use('Test/Suite')('Company');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Company = use('App/Models/Company');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create company', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/companies')
    .loginVia(user, 'jwt')
    .send({
      name: 'Unimed Varginha Cooperativa de Trabalho Médico',
      code: 50,
      created_by: user.id,
    })
    .end();

  response.assertStatus(201);
});

test('it cannot be able to register a duplicate company', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').make({
    name: 'Unimed Varginha Cooperativa de Trabalho Médico',
    code: 50,
    created_by: user.id,
    updated_by: user.id,
  });

  const companyDuplicated = await Factory.model('App/Models/Company').make({
    name: 'Unimed Varginha Cooperativa de Trabalho Médico',
    code: 50,
    created_by: user.id,
    updated_by: user.id,
  });

  const response = await client
    .post('/companies')
    .loginVia(user, 'jwt')
    .send(company.toJSON())
    .end();

  response.assertStatus(201);

  const responseDuplicate = await client
    .post('/companies')
    .loginVia(user, 'jwt')
    .send(companyDuplicated.toJSON())
    .end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list companies', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').make({ created_by: user.id, updated_by: user.id });

  await user.createCompany().save(company);

  const response = await client
    .get('/companies')
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body[0].name, company.name);
  assert.equal(response.body[0].createdBy.id, user.id);
});

test('it should be able to show single company', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id, updated_by: user.id });

  await user.createCompany().save(company);

  const response = await client
    .get(`/companies/${company.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body.name, company.name);
  assert.equal(response.body.createdBy.id, user.id);
});

test('it should be able to update company', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ updated_by: user.id });

  await user.createCompany().save(company);

  const response = await client
    .put(`/companies/${company.id}`)
    .loginVia(user, 'jwt')
    .send({ ...company.toJSON(), name: 'Unimed Três Pontas Cooperativa de Trabalho Médico' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.name, 'Unimed Três Pontas Cooperativa de Trabalho Médico');
});

test('it should be able to delete company', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ updated_by: user.id });

  await user.createCompany().save(company);

  const response = await client
    .delete(`/companies/${company.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
  const checkCompany = await Company.find(company.id);
  assert.isNull(checkCompany);
});
