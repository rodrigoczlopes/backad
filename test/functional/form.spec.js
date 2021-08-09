const { test, trait } = use('Test/Suite')('Form');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Form = use('App/Models/Form');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create form', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ company_id: company.id, created_by: user.id });
  const response = await client
    .post('/forms')
    .loginVia(user, 'jwt')
    .send({
      name: 'Formulário Administrativo',
      observation: 'Alguma observação aqui',
      company_id: company.id,
      path_id: path.id,
      created_by: user.id,
    })
    .end();
  response.assertStatus(201);
});

test('it cannot be able to register a duplicate form', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ company_id: company.id, created_by: user.id });
  const form = await Factory.model('App/Models/Form').make({
    name: 'Formulário Administrativo',
    path_id: path.id,
    company_id: company.id,
    created_by: user.id,
  });

  const formDuplicated = await Factory.model('App/Models/Form').make({
    name: 'Formulário Administrativo',
    path_id: path.id,
    company_id: company.id,
    created_by: user.id,
  });

  const response = await client.post('/forms').loginVia(user, 'jwt').send(form.toJSON()).end();

  response.assertStatus(201);

  const responseDuplicate = await client.post('/forms').loginVia(user, 'jwt').send(formDuplicated.toJSON()).end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list forms', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ company_id: company.id, created_by: user.id });
  const form = await Factory.model('App/Models/Form').make({ path_id: path.id, company_id: company.id, created_by: user.id });

  await company.forms().save(form);

  const response = await client.get('/forms').loginVia(user, 'jwt').end();
  response.assertStatus(200);

  assert.equal(response.body[0].name, form.name);
  assert.equal(response.body[0].createdBy.id, user.id);
  assert.equal(response.body[0].companies.name, 'OrangeDev');
});

test('it should be able to show single form', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ company_id: company.id, created_by: user.id });
  const form = await Factory.model('App/Models/Form').make({ path_id: path.id, company_id: company.id, created_by: user.id });

  await company.forms().save(form);

  const response = await client.get(`/forms/${form.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body.name, form.name);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, 'OrangeDev');
});

test('it should be able to update form', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ company_id: company.id, created_by: user.id });
  const form = await Factory.model('App/Models/Form').make({ path_id: path.id, company_id: company.id, created_by: user.id });

  await company.forms().save(form);

  const response = await client
    .put(`/forms/${form.id}`)
    .loginVia(user, 'jwt')
    .send({ ...form.toJSON(), name: 'Formulário Gestão' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.name, 'Formulário Gestão');
});

test('it should not be able to update form with an existing name', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ company_id: company.id, created_by: user.id });
  await Factory.model('App/Models/Form').create({
    name: 'Formulário Gestão',
    path_id: path.id,
    company_id: company.id,
    created_by: user.id,
  });
  const form = await Factory.model('App/Models/Form').create({
    name: 'Formulário Administrativo',
    path_id: path.id,
    company_id: company.id,
    created_by: user.id,
  });

  const response = await client
    .put(`/forms/${form.id}`)
    .loginVia(user, 'jwt')
    .send({ ...form.toJSON(), name: 'Formulário Gestão' })
    .end();

  response.assertStatus(400);
});

test('it should be able to delete form', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ company_id: company.id, created_by: user.id });
  const form = await Factory.model('App/Models/Form').make({ path_id: path.id, company_id: company.id, created_by: user.id });

  await company.forms().save(form);

  const response = await client.delete(`/forms/${form.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(204);
  const checkForm = await Form.find(form.id);
  assert.isNull(checkForm);
});
