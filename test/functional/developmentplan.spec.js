const { test, trait } = use('Test/Suite')('DevelopmentPlan');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const DevelopmentPlan = use('App/Models/DevelopmentPlan');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create development plan', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const response = await client
    .post('/developmentplans')
    .loginVia(user, 'jwt')
    .send({
      action: 'Coaching Interno',
      description:
        'O coach é o próprio líder, que deve atuar como um treinador que ensina "jogadas", da diretrizes e estimula o desenvolvimento do liderado',
      company_id: company.id,
      created_by: user.id,
    })
    .end();
  response.assertStatus(201);
});

test('it should not be able to register a duplicate development plan', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const developmentPlan = await Factory.model('App/Models/DevelopmentPlan').make({
    action: 'Coaching Interno',
    description:
      'O coach é o próprio líder, que deve atuar como um treinador que ensina "jogadas", da diretrizes e estimula o desenvolvimento do liderado',
    company_id: company.id,
    created_by: user.id,
  });

  const developmentPlanDuplicated = await Factory.model('App/Models/DevelopmentPlan').make({
    action: 'Coaching Interno',
    description:
      'O coach é o próprio líder, que deve atuar como um treinador que ensina "jogadas", da diretrizes e estimula o desenvolvimento do liderado',
    company_id: company.id,
    created_by: user.id,
  });

  const response = await client.post('/developmentplans').loginVia(user, 'jwt').send(developmentPlan.toJSON()).end();

  response.assertStatus(201);

  const responseDuplicate = await client
    .post('/developmentplans')
    .loginVia(user, 'jwt')
    .send(developmentPlanDuplicated.toJSON())
    .end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list development plans', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const developmentPlan = await Factory.model('App/Models/DevelopmentPlan').make({ company_id: company.id, created_by: user.id });

  await company.developmentPlans().save(developmentPlan);

  const response = await client.get('/developmentplans').loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body[0].action, developmentPlan.action);
  assert.equal(response.body[0].createdBy.id, user.id);
  assert.equal(response.body[0].companies.name, 'OrangeDev');
});

test('it should be able to show single development plan', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const developmentPlan = await Factory.model('App/Models/DevelopmentPlan').make({ company_id: company.id, created_by: user.id });

  await company.developmentPlans().save(developmentPlan);

  const response = await client.get(`/developmentplans/${developmentPlan.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body.action, developmentPlan.action);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, 'OrangeDev');
});

test('it should be able to update development plan', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const developmenPlan = await Factory.model('App/Models/DevelopmentPlan').make({ company_id: company.id, created_by: user.id });

  await company.developmentPlans().save(developmenPlan);

  const response = await client
    .put(`/developmentplans/${developmenPlan.id}`)
    .loginVia(user, 'jwt')
    .send({ ...developmenPlan.toJSON(), action: 'Estágio em outra área' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.action, 'Estágio em outra área');
});

test('it should be able to delete developmenPlan', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const developmentPlan = await Factory.model('App/Models/DevelopmentPlan').make({ company_id: company.id, created_by: user.id });

  await company.developmentPlans().save(developmentPlan);

  const response = await client.delete(`/developmentplans/${developmentPlan.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(204);
  const checkDevelopmentPlan = await DevelopmentPlan.find(developmentPlan.id);
  assert.isNull(checkDevelopmentPlan);
});
