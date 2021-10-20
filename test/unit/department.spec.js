const { test, trait } = use('Test/Suite')('Department');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Department = use('App/Models/Department');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

const makeDepartment = async () => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const department = {
    name: 'Tecnologia da Informação',
    area_code: 330,
    level: '01.03.02',
    company_id: company.id,
    created_by: user.id,
  };

  const departmentFactory = await Factory.model('App/Models/Department').make(department);
  return { department, user, company, departmentFactory };
};

test('it should be able to create department', async ({ client }) => {
  const { user, department } = await makeDepartment();
  const response = await client.post('/departments').loginVia(user, 'jwt').send(department).end();
  response.assertStatus(201);
});

test('it should not be able to register a duplicate department', async ({ client }) => {
  const { user, department: departmentMock } = await makeDepartment();
  const department = await Factory.model('App/Models/Department').make(departmentMock);

  const departmentDuplicated = await Factory.model('App/Models/Department').make(departmentMock);

  const response = await client.post('/departments').loginVia(user, 'jwt').send(department.toJSON()).end();

  response.assertStatus(201);

  const responseDuplicate = await client.post('/departments').loginVia(user, 'jwt').send(departmentDuplicated.toJSON()).end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list departments', async ({ assert, client }) => {
  const { user, departmentFactory, company } = await makeDepartment();

  await company.departments().save(departmentFactory);

  const response = await client.get('/departments').loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body[0].name, departmentFactory.name);
  assert.equal(response.body[0].createdBy.id, user.id);
  assert.equal(response.body[0].companies.name, company.name);
});

test('it should be able to show single department', async ({ assert, client }) => {
  const { user, departmentFactory, company } = await makeDepartment();

  await company.departments().save(departmentFactory);

  const response = await client.get(`/departments/${departmentFactory.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body.name, departmentFactory.name);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, company.name);
});

test('it should be able to update department', async ({ assert, client }) => {
  const { user, departmentFactory, company } = await makeDepartment();

  await company.departments().save(departmentFactory);

  const response = await client
    .put(`/departments/${departmentFactory.id}`)
    .loginVia(user, 'jwt')
    .send({ ...departmentFactory.toJSON(), name: 'Tecnologia da Informação' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.name, 'Tecnologia da Informação');
});

test('it should be able to delete department', async ({ assert, client }) => {
  const { user, departmentFactory, company } = await makeDepartment();

  await company.departments().save(departmentFactory);

  const response = await client.delete(`/departments/${departmentFactory.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(204);
  const checkDepartment = await Department.find(departmentFactory.id);
  assert.isNull(checkDepartment);
});
