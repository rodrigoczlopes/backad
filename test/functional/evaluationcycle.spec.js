const { test, trait } = use('Test/Suite')('EvaluationCycle');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const EvaluationCycle = use('App/Models/EvaluationCycle');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create evaluation cycle', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').make({
    description: 'Avaliação de desempenho | 2020',
    company_id: company.id,
    created_by: user.id,
  });
  const response = await client
    .post('/evaluationcycles')
    .loginVia(user, 'jwt')
    .send(evaluationCycle.toJSON())
    .end();
  response.assertStatus(201);
});

test('it should not be able to register a duplicate evaluation cycle', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').make({
    description: 'Avaliação de desempenho | 2019',
    company_id: company.id,
    created_by: user.id,
  });

  const evaluationCycleDuplicated = await Factory.model('App/Models/EvaluationCycle').make({
    description: 'Avaliação de desempenho | 2019',
    company_id: company.id,
    created_by: user.id,
  });

  const response = await client
    .post('/evaluationcycles')
    .loginVia(user, 'jwt')
    .send(evaluationCycle.toJSON())
    .end();

  response.assertStatus(201);

  const responseDuplicate = await client
    .post('/evaluationcycles')
    .loginVia(user, 'jwt')
    .send(evaluationCycleDuplicated.toJSON())
    .end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list evaluation cycle', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').make({ company_id: company.id, created_by: user.id });

  await company.evaluationCycles().save(evaluationCycle);

  const response = await client
    .get('/evaluationcycles')
    .loginVia(user, 'jwt')
    .end();

  console.log(response);
  response.assertStatus(200);

  assert.equal(response.body[0].description, evaluationCycle.description);
  assert.equal(response.body[0].createdBy.id, user.id);
  assert.equal(response.body[0].companies.name, 'OrangeDev');
});

test('it should be able to show single evaluation cycle', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').make({ company_id: company.id, created_by: user.id });

  await company.evaluationCycles().save(evaluationCycle);

  const response = await client
    .get(`/evaluationcycles/${evaluationCycle.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body.description, evaluationCycle.description);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, 'OrangeDev');
});

test('it should be able to update evaluation cycle', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').make({ company_id: company.id, created_by: user.id });

  await company.evaluationCycles().save(evaluationCycle);

  const response = await client
    .put(`/evaluationcycles/${evaluationCycle.id}`)
    .loginVia(user, 'jwt')
    .send({ ...evaluationCycle.toJSON(), description: 'Avaliação por Competência | 2020' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.description, 'Avaliação por Competência | 2020');
});

test('it should be able to delete evaluation cycle', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').make({ company_id: company.id, created_by: user.id });

  await company.evaluationCycles().save(evaluationCycle);

  const response = await client
    .delete(`/evaluationcycles/${evaluationCycle.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
  const checkEvaluationCycle = await EvaluationCycle.find(evaluationCycle.id);
  assert.isNull(checkEvaluationCycle);
});
