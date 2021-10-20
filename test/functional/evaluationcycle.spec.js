const { test, trait } = use('Test/Suite')('Evaluation Cycle');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const EvaluationCycle = use('App/Models/EvaluationCycle');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

const makeEvaluationCycle = async () => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const evaluationCycle = {
    description: 'Avaliação de desempenho | 2020',
    company_id: company.id,
    created_by: user.id,
  };

  const evaluationCycleMock = await Factory.model('App/Models/EvaluationCycle').make(evaluationCycle);
  return { user, company, evaluationCycle, evaluationCycleMock };
};

test('it should be able to create evaluation cycle', async ({ client }) => {
  const { evaluationCycleMock, user } = await makeEvaluationCycle();
  const response = await client.post('/evaluationcycles').loginVia(user, 'jwt').send(evaluationCycleMock.toJSON()).end();
  response.assertStatus(201);
});

test('it should not be able to register a duplicate evaluation cycle', async ({ client }) => {
  const { user, evaluationCycle: evaluationCycleMake } = await makeEvaluationCycle();

  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').make(evaluationCycleMake);

  const evaluationCycleDuplicated = await Factory.model('App/Models/EvaluationCycle').make(evaluationCycleMake);

  const response = await client.post('/evaluationcycles').loginVia(user, 'jwt').send(evaluationCycle.toJSON()).end();

  response.assertStatus(201);

  const responseDuplicate = await client
    .post('/evaluationcycles')
    .loginVia(user, 'jwt')
    .send(evaluationCycleDuplicated.toJSON())
    .end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list evaluation cycle', async ({ assert, client }) => {
  const { user, evaluationCycleMock, company } = await makeEvaluationCycle();

  await company.evaluationCycles().save(evaluationCycleMock);

  const response = await client.get('/evaluationcycles').loginVia(user, 'jwt').end();

  response.assertStatus(200);

  const { data } = response.body;

  assert.equal(data[0].description, evaluationCycleMock.description);
  assert.equal(data[0].createdBy.id, user.id);
  assert.equal(data[0].companies.name, company.name);
});

test('it should be able to show single evaluation cycle', async ({ assert, client }) => {
  const { user, evaluationCycleMock, company } = await makeEvaluationCycle();
  await company.evaluationCycles().save(evaluationCycleMock);

  const response = await client.get(`/evaluationcycles/${evaluationCycleMock.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body.description, evaluationCycleMock.description);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, company.name);
});

test('it should be able to update evaluation cycle', async ({ assert, client }) => {
  const { user, evaluationCycleMock, company } = await makeEvaluationCycle();

  await company.evaluationCycles().save(evaluationCycleMock);

  const response = await client
    .put(`/evaluationcycles/${evaluationCycleMock.id}`)
    .loginVia(user, 'jwt')
    .send({ ...evaluationCycleMock.toJSON(), description: 'Avaliação por Competência | 2020' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.description, 'Avaliação por Competência | 2020');
});

test('it should be able to delete evaluation cycle', async ({ assert, client }) => {
  const { user, evaluationCycleMock, company } = await makeEvaluationCycle();

  await company.evaluationCycles().save(evaluationCycleMock);

  const response = await client.delete(`/evaluationcycles/${evaluationCycleMock.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(204);
  const checkEvaluationCycle = await EvaluationCycle.find(evaluationCycleMock.id);
  assert.isNull(checkEvaluationCycle);
});
