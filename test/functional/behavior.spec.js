const { test, trait } = use('Test/Suite')('Behavior');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Behavior = use('App/Models/Behavior');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create behavior', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ company_id: company.id, created_by: user.id });
  const skill = await Factory.model('App/Models/Skill').create({ company_id: company.id, created_by: user.id });
  const response = await client
    .post('/behaviors')
    .loginVia(user, 'jwt')
    .send({
      description:
        'Correlaciona a dinâmica organizacional com aspectos relevantes da(s) área(s) sob sua responsabilidade, considerando o impacto de suas ações',
      path_id: path.id,
      skill_id: skill.id,
      company_id: company.id,
      created_by: user.id,
    })
    .end();
  response.assertStatus(201);
});

test('it should not be able to register a duplicate behavior', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ created_by: user.id });
  const skill = await Factory.model('App/Models/Skill').create({ created_by: user.id });
  const behavior = await Factory.model('App/Models/Behavior').make({
    description:
      'Comunicar informações relevantes de forma clara, objetiva e compreensivel, utilizando de forma eficaz as ferraqmentas de comunicação da organização',
    path_id: path.id,
    skill_id: skill.id,
    company_id: company.id,
    created_by: user.id,
  });

  const behaviorDuplicated = await Factory.model('App/Models/Behavior').make({
    description:
      'Comunicar informações relevantes de forma clara, objetiva e compreensivel, utilizando de forma eficaz as ferraqmentas de comunicação da organização',
    path_id: path.id,
    skill_id: skill.id,
    company_id: company.id,
    created_by: user.id,
  });

  const response = await client.post('/behaviors').loginVia(user, 'jwt').send(behavior.toJSON()).end();

  response.assertStatus(201);

  const responseDuplicate = await client.post('/behaviors').loginVia(user, 'jwt').send(behaviorDuplicated.toJSON()).end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list behaviors', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ created_by: user.id });
  const skill = await Factory.model('App/Models/Skill').create({ created_by: user.id });
  const behavior = await Factory.model('App/Models/Behavior').make({
    path_id: path.id,
    skill_id: skill.id,
    company_id: company.id,
    created_by: user.id,
  });

  await company.behaviors().save(behavior);

  const response = await client.get('/behaviors').loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body[0].name, behavior.name);
  assert.equal(response.body[0].createdBy.id, user.id);
  assert.equal(response.body[0].companies.name, 'OrangeDev');
});

test('it should be able to show single behavior', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ created_by: user.id });
  const skill = await Factory.model('App/Models/Skill').create({ created_by: user.id });
  const behavior = await Factory.model('App/Models/Behavior').make({
    path_id: path.id,
    skill_id: skill.id,
    company_id: company.id,
    created_by: user.id,
  });

  await company.behaviors().save(behavior);

  const response = await client.get(`/behaviors/${behavior.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body.name, behavior.name);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, 'OrangeDev');
});

test('it should be able to update behavior', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ created_by: user.id });
  const skill = await Factory.model('App/Models/Skill').create({ created_by: user.id });
  const behavior = await Factory.model('App/Models/Behavior').make({
    path_id: path.id,
    skill_id: skill.id,
    company_id: company.id,
    created_by: user.id,
  });

  await company.behaviors().save(behavior);

  const response = await client
    .put(`/behaviors/${behavior.id}`)
    .loginVia(user, 'jwt')
    .send({ ...behavior.toJSON(), description: 'Atuação Sistêmica' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.description, 'Atuação Sistêmica');
});

test('it should be able to delete behavior', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const path = await Factory.model('App/Models/Path').create({ created_by: user.id });
  const skill = await Factory.model('App/Models/Skill').create({ created_by: user.id });
  const behavior = await Factory.model('App/Models/Behavior').make({
    path_id: path.id,
    skill_id: skill.id,
    company_id: company.id,
    created_by: user.id,
  });

  await company.behaviors().save(behavior);

  const response = await client.delete(`/behaviors/${behavior.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(204);
  const checkBehavior = await Behavior.find(behavior.id);
  assert.isNull(checkBehavior);
});
