const { test, trait } = use('Test/Suite')('Classification');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Classification = use('App/Models/Classification');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

const makeClassification = async () => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });

  const classification = {
    description: 'Quais foram as principais contribuições do avaliado no período?',
    company_id: company.id,
    created_by: user.id,
  };

  return { user, company, classification };
};

test('it should be able to create classification', async ({ client }) => {
  const { classification, user } = await makeClassification();
  const response = await client.post('/classifications').loginVia(user, 'jwt').send(classification).end();
  response.assertStatus(201);
});

test('it should not be able to register a duplicate classification', async ({ client }) => {
  const { classification: classificationMock, user } = await makeClassification();

  const classification = await Factory.model('App/Models/Classification').make(classificationMock);

  const classificationDuplicated = await Factory.model('App/Models/Classification').make(classificationMock);

  const response = await client.post('/classifications').loginVia(user, 'jwt').send(classification.toJSON()).end();

  response.assertStatus(201);

  const responseDuplicate = await client
    .post('/classifications')
    .loginVia(user, 'jwt')
    .send(classificationDuplicated.toJSON())
    .end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list classifications', async ({ assert, client }) => {
  const { classification: classificationMock, user, company } = await makeClassification();

  const classification = await Factory.model('App/Models/Classification').make(classificationMock);

  await company.classifications().save(classification);

  const response = await client.get('/classifications').loginVia(user, 'jwt').end();

  response.assertStatus(200);

  const { data } = response.body;

  assert.equal(data[0].description, classification.description);
  assert.equal(data[0].createdBy.id, user.id);
  assert.equal(data[0].companies.name, company.name);
});

test('it should be able to show single classification', async ({ assert, client }) => {
  const { classification: classificationMock, user, company } = await makeClassification();

  const classification = await Factory.model('App/Models/Classification').make(classificationMock);

  await company.classifications().save(classification);

  const response = await client.get(`/classifications/${classification.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body.description, classification.description);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, company.name);
});

test('it should be able to update classification', async ({ assert, client }) => {
  const { classification: classificationMock, user, company } = await makeClassification();

  const classification = await Factory.model('App/Models/Classification').make(classificationMock);

  await company.classifications().save(classification);

  const response = await client
    .put(`/classifications/${classification.id}`)
    .loginVia(user, 'jwt')
    .send({ ...classification.toJSON(), description: 'Comenta nada' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.description, 'Comenta nada');
});

test('it should be able to delete classification', async ({ assert, client }) => {
  const { classification: classificationMock, user, company } = await makeClassification();

  const classification = await Factory.model('App/Models/Classification').make(classificationMock);

  await company.classifications().save(classification);

  const response = await client.delete(`/classifications/${classification.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(204);
  const checkClassification = await Classification.find(classification.id);
  assert.isNull(checkClassification);
});
