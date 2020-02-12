const { test, trait } = use('Test/Suite')('Department');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
// const Department = use('App/Models/Department');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create department', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const response = await client
    .post('/departments')
    .loginVia(user, 'jwt')
    .send({
      name: 'Tecnologia da Informação',
      area_code: 330,
      level: '01.03.02',
      company_id: company.id,
      created_by: user.id,
    })
    .end();
  response.assertStatus(201);
});

test('it cannot be able to register a duplicate department', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const department = await Factory.model('App/Models/Department').make({
    name: 'Tecnologia da Informação',
    area_code: 50,
    level: '01.03.02',
    company_id: company.id,
    created_by: user.id,
  });

  const departmentDuplicated = await Factory.model('App/Models/Department').make({
    name: 'Tecnologia da Informação',
    area_code: 50,
    level: '01.03.02',
    company_id: company.id,
    created_by: user.id,
  });

  const response = await client
    .post('/departments')
    .loginVia(user, 'jwt')
    .send(department.toJSON())
    .end();

  response.assertStatus(201);

  const responseDuplicate = await client
    .post('/departments')
    .loginVia(user, 'jwt')
    .send(departmentDuplicated.toJSON())
    .end();
  responseDuplicate.assertStatus(500);
});

test('it should be able to list departments', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const department = await Factory.model('App/Models/Department').make({ company_id: company.id, created_by: user.id });

  await user.createCompany().save(company);
  await company.departments().save(department);

  const response = await client
    .get('/companies')
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body[0].name, department.name);
  assert.equal(response.body[0].createdBy.id, user.id);
});

// test('it should be able to show single company', async ({ assert, client }) => {
//   const user = await Factory.model('App/Models/User').create();
//   const company = await Factory.model('App/Models/Company').create({ created_by: user.id, updated_by: user.id });

//   await user.createGroup().save(company);

//   const response = await client
//     .get(`/companies/${company.id}`)
//     .loginVia(user, 'jwt')
//     .end();

//   response.assertStatus(200);

//   assert.equal(response.body.name, company.name);
//   assert.equal(response.body.createdBy.id, user.id);
// });

// test('it should be able to update company', async ({ assert, client }) => {
//   const user = await Factory.model('App/Models/User').create();
//   const company = await Factory.model('App/Models/Company').create({ updated_by: user.id });

//   await user.createGroup().save(company);

//   const response = await client
//     .put(`/companies/${company.id}`)
//     .loginVia(user, 'jwt')
//     .send({ ...company.toJSON(), name: 'Unimed Três Pontas Cooperativa de Trabalho Médico' })
//     .end();

//   response.assertStatus(200);

//   assert.equal(response.body.name, 'Unimed Três Pontas Cooperativa de Trabalho Médico');
// });

// test('it should be able to delete company', async ({ assert, client }) => {
//   const user = await Factory.model('App/Models/User').create();
//   const company = await Factory.model('App/Models/Company').create({ updated_by: user.id });

//   await user.createGroup().save(company);

//   const response = await client
//     .delete(`/companies/${company.id}`)
//     .loginVia(user, 'jwt')
//     .end();

//   response.assertStatus(204);
//   const checkCompany = await Company.find(company.id);
//   assert.isNull(checkCompany);
// });
