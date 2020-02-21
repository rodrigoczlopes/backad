const { test, trait } = use('Test/Suite')('EvaluationCycleArea');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const EvaluationCycleArea = use('App/Models/EvaluationCycleArea');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create evaluation cycle area', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').create({
    company_id: company.id,
    created_by: user.id,
  });
  const department = await Factory.model('App/Models/Department').create({ company_id: company.id, created_by: user.id });
  const evaluationCycleArea = await Factory.model('App/Models/EvaluationCycleArea').make({
    evaluation_cycle_id: evaluationCycle.id,
    department_id: department.id,
    created_by: user.id,
  });
  const response = await client
    .post('/evaluationcycleareas')
    .loginVia(user, 'jwt')
    .send(evaluationCycleArea.toJSON())
    .end();
  response.assertStatus(201);
});

test('it should not be able to register a duplicate evaluation cycle area', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').create({
    company_id: company.id,
    created_by: user.id,
  });
  const department = await Factory.model('App/Models/Department').create({ company_id: company.id, created_by: user.id });
  const evaluationCycleArea = await Factory.model('App/Models/EvaluationCycleArea').make({
    evaluation_cycle_id: evaluationCycle.id,
    department_id: department.id,
    created_by: user.id,
  });

  const evaluationCycleAreaDuplicated = await Factory.model('App/Models/EvaluationCycleArea').make({
    evaluation_cycle_id: evaluationCycle.id,
    department_id: department.id,
    created_by: user.id,
  });

  const response = await client
    .post('/evaluationcycleareas')
    .loginVia(user, 'jwt')
    .send(evaluationCycleArea.toJSON())
    .end();

  response.assertStatus(201);

  const responseDuplicate = await client
    .post('/evaluationcycleareas')
    .loginVia(user, 'jwt')
    .send(evaluationCycleAreaDuplicated.toJSON())
    .end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list evaluation cycle area', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').create({
    company_id: company.id,
    created_by: user.id,
  });
  const department = await Factory.model('App/Models/Department').create({ company_id: company.id, created_by: user.id });
  const evaluationCycleArea = await Factory.model('App/Models/EvaluationCycleArea').make({
    evaluation_cycle_id: evaluationCycle.id,
    department_id: department.id,
    created_by: user.id,
  });

  await evaluationCycle.evaluationCycleAreas().save(evaluationCycleArea);

  const response = await client
    .get('/evaluationcycleareas')
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body[0].evaluation_cycle_id, evaluationCycleArea.evaluation_cycle_id);
  assert.equal(response.body[0].createdBy.id, user.id);
});

test('it should be able to show single evaluation cycle area', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').create({
    company_id: company.id,
    created_by: user.id,
  });
  const department = await Factory.model('App/Models/Department').create({ company_id: company.id, created_by: user.id });
  const evaluationCycleArea = await Factory.model('App/Models/EvaluationCycleArea').make({
    evaluation_cycle_id: evaluationCycle.id,
    department_id: department.id,
    created_by: user.id,
  });

  await evaluationCycle.evaluationCycleAreas().save(evaluationCycleArea);

  const response = await client
    .get(`/evaluationcycleareas/${evaluationCycleArea.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body.evaluation_cycle_id, evaluationCycleArea.evaluation_cycle_id);
  assert.equal(response.body.createdBy.id, user.id);
});

test('it should be able to update evaluation cycle area', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').create({
    company_id: company.id,
    created_by: user.id,
  });
  const department = await Factory.model('App/Models/Department').create({ company_id: company.id, created_by: user.id });
  const evaluationCycleArea = await Factory.model('App/Models/EvaluationCycleArea').make({
    evaluation_cycle_id: evaluationCycle.id,
    department_id: department.id,
    created_by: user.id,
  });

  const departmentNew = await Factory.model('App/Models/Department').create({ company_id: company.id, created_by: user.id });

  await evaluationCycle.evaluationCycleAreas().save(evaluationCycleArea);

  const response = await client
    .put(`/evaluationcycleareas/${evaluationCycleArea.id}`)
    .loginVia(user, 'jwt')
    .send({ ...evaluationCycleArea.toJSON(), department_id: departmentNew.id })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.department_id, departmentNew.id);
});

test('it should be able to delete evaluation cycle area', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const evaluationCycle = await Factory.model('App/Models/EvaluationCycle').create({
    company_id: company.id,
    created_by: user.id,
  });
  const department = await Factory.model('App/Models/Department').create({ company_id: company.id, created_by: user.id });
  const evaluationCycleArea = await Factory.model('App/Models/EvaluationCycleArea').make({
    evaluation_cycle_id: evaluationCycle.id,
    department_id: department.id,
    created_by: user.id,
  });

  await evaluationCycle.evaluationCycleAreas().save(evaluationCycleArea);

  const response = await client
    .delete(`/evaluationcycleareas/${evaluationCycleArea.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
  const checkEvaluationCycleArea = await EvaluationCycleArea.find(evaluationCycleArea.id);
  assert.isNull(checkEvaluationCycleArea);
});
