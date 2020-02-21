const { test, trait } = use('Test/Suite')('EvaluationCycleLevel');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const EvaluationCycleLevel = use('App/Models/EvaluationCycleLevel');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create evaluation cycle level', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').create({
    company_id: company.id,
    created_by: user.id,
  });
  const hierarchy = await Factory.model('App/Models/Hierarchy').create({ company_id: company.id, created_by: user.id });
  const evaluationCycleLevel = await Factory.model('App/Models/EvaluationCycleLevel').make({
    evaluation_cycle_id: evaluationCycle.id,
    hierarchy_id: hierarchy.id,
    created_by: user.id,
  });
  const response = await client
    .post('/evaluationcyclelevels')
    .loginVia(user, 'jwt')
    .send(evaluationCycleLevel.toJSON())
    .end();
  response.assertStatus(201);
});

test('it should not be able to register a duplicate evaluation cycle level', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').create({
    company_id: company.id,
    created_by: user.id,
  });
  const hierarchy = await Factory.model('App/Models/Hierarchy').create({ company_id: company.id, created_by: user.id });
  const evaluationCycleLevel = await Factory.model('App/Models/EvaluationCycleLevel').make({
    evaluation_cycle_id: evaluationCycle.id,
    hierarchy_id: hierarchy.id,
    created_by: user.id,
  });

  const evaluationCycleLevelDuplicated = await Factory.model('App/Models/EvaluationCycleLevel').make({
    evaluation_cycle_id: evaluationCycle.id,
    hierarchy_id: hierarchy.id,
    created_by: user.id,
  });

  const response = await client
    .post('/evaluationcycleLevels')
    .loginVia(user, 'jwt')
    .send(evaluationCycleLevel.toJSON())
    .end();

  response.assertStatus(201);

  const responseDuplicate = await client
    .post('/evaluationcycleLevels')
    .loginVia(user, 'jwt')
    .send(evaluationCycleLevelDuplicated.toJSON())
    .end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list evaluation cycle level', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').create({
    company_id: company.id,
    created_by: user.id,
  });
  const hierarchy = await Factory.model('App/Models/Hierarchy').create({ company_id: company.id, created_by: user.id });
  const evaluationCycleLevel = await Factory.model('App/Models/EvaluationCycleLevel').make({
    evaluation_cycle_id: evaluationCycle.id,
    hierarchy_id: hierarchy.id,
    created_by: user.id,
  });

  await evaluationCycle.evaluationCycleLevels().save(evaluationCycleLevel);

  const response = await client
    .get('/evaluationcycleLevels')
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body[0].evaluation_cycle_id, evaluationCycleLevel.evaluation_cycle_id);
  assert.equal(response.body[0].createdBy.id, user.id);
});

test('it should be able to show single evaluation cycle level', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').create({
    company_id: company.id,
    created_by: user.id,
  });
  const hierarchy = await Factory.model('App/Models/Hierarchy').create({ company_id: company.id, created_by: user.id });
  const evaluationCycleLevel = await Factory.model('App/Models/EvaluationCycleLevel').make({
    evaluation_cycle_id: evaluationCycle.id,
    hierarchy_id: hierarchy.id,
    created_by: user.id,
  });

  await evaluationCycle.evaluationCycleLevels().save(evaluationCycleLevel);

  const response = await client
    .get(`/evaluationcycleLevels/${evaluationCycleLevel.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body.evaluation_cycle_id, evaluationCycleLevel.evaluation_cycle_id);
  assert.equal(response.body.createdBy.id, user.id);
});

test('it should be able to update evaluation cycle level', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').create({
    company_id: company.id,
    created_by: user.id,
  });
  const hierarchy = await Factory.model('App/Models/Hierarchy').create({ company_id: company.id, created_by: user.id });
  const evaluationCycleLevel = await Factory.model('App/Models/EvaluationCycleLevel').make({
    evaluation_cycle_id: evaluationCycle.id,
    hierarchy_id: hierarchy.id,
    created_by: user.id,
  });

  const hierarchyNew = await Factory.model('App/Models/Hierarchy').create({ company_id: company.id, created_by: user.id });

  await evaluationCycle.evaluationCycleLevels().save(evaluationCycleLevel);

  const response = await client
    .put(`/evaluationcycleLevels/${evaluationCycleLevel.id}`)
    .loginVia(user, 'jwt')
    .send({ ...evaluationCycleLevel.toJSON(), hierarchy_id: hierarchyNew.id })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.hierarchy_id, hierarchyNew.id);
});

test('it should be able to delete evaluation cycle level', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').create({
    company_id: company.id,
    created_by: user.id,
  });
  const hierarchy = await Factory.model('App/Models/Hierarchy').create({ company_id: company.id, created_by: user.id });
  const evaluationCycleLevel = await Factory.model('App/Models/EvaluationCycleLevel').make({
    evaluation_cycle_id: evaluationCycle.id,
    hierarchy_id: hierarchy.id,
    created_by: user.id,
  });

  await evaluationCycle.evaluationCycleLevels().save(evaluationCycleLevel);

  const response = await client
    .delete(`/evaluationcycleLevels/${evaluationCycleLevel.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
  const checkEvaluationCycleLevel = await EvaluationCycleLevel.find(evaluationCycleLevel.id);
  assert.isNull(checkEvaluationCycleLevel);
});
