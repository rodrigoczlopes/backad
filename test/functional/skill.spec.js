const { test, trait } = use('Test/Suite')('Skill');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Skill = use('App/Models/Skill');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create skill', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const response = await client
    .post('/skills')
    .loginVia(user, 'jwt')
    .send({
      name: 'Comunicação',
      description:
        'Comunicar informações relevantes de forma clara, objetiva e compreensivel, utilizando de forma eficaz as ferraqmentas de comunicação da organização',
      company_id: company.id,
      created_by: user.id,
    })
    .end();
  response.assertStatus(201);
});

test('it should not be able to register a duplicate skill', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const skill = await Factory.model('App/Models/Skill').make({
    name: 'Comunicação',
    description:
      'Comunicar informações relevantes de forma clara, objetiva e compreensivel, utilizando de forma eficaz as ferraqmentas de comunicação da organização',
    company_id: company.id,
    created_by: user.id,
  });

  const skillDuplicated = await Factory.model('App/Models/Skill').make({
    name: 'Comunicação',
    description:
      'Comunicar informações relevantes de forma clara, objetiva e compreensivel, utilizando de forma eficaz as ferraqmentas de comunicação da organização',
    company_id: company.id,
    created_by: user.id,
  });

  const response = await client
    .post('/skills')
    .loginVia(user, 'jwt')
    .send(skill.toJSON())
    .end();

  response.assertStatus(201);

  const responseDuplicate = await client
    .post('/skills')
    .loginVia(user, 'jwt')
    .send(skillDuplicated.toJSON())
    .end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list skills', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const skill = await Factory.model('App/Models/Skill').make({ company_id: company.id, created_by: user.id });

  await company.skills().save(skill);

  const response = await client
    .get('/skills')
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body[0].name, skill.name);
  assert.equal(response.body[0].createdBy.id, user.id);
  assert.equal(response.body[0].companies.name, 'OrangeDev');
});

test('it should be able to show single skill', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const skill = await Factory.model('App/Models/Skill').make({ company_id: company.id, created_by: user.id });

  await company.skills().save(skill);

  const response = await client
    .get(`/skills/${skill.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body.name, skill.name);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, 'OrangeDev');
});

test('it should be able to update skill', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const skill = await Factory.model('App/Models/Skill').make({ company_id: company.id, created_by: user.id });

  await company.skills().save(skill);

  const response = await client
    .put(`/skills/${skill.id}`)
    .loginVia(user, 'jwt')
    .send({ ...skill.toJSON(), name: 'Atuação Sistêmica' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.name, 'Atuação Sistêmica');
});

test('it should be able to delete skill', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const skill = await Factory.model('App/Models/Skill').make({ company_id: company.id, created_by: user.id });

  await company.skills().save(skill);

  const response = await client
    .delete(`/skills/${skill.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
  const checkSkill = await Skill.find(skill.id);
  assert.isNull(checkSkill);
});
