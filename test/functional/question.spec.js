const { test, trait } = use('Test/Suite')('Question');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Question = use('App/Models/Question');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create question', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const response = await client
    .post('/questions')
    .loginVia(user, 'jwt')
    .send({
      description: 'Comente sobre sua avaliação',
      company_id: company.id,
      created_by: user.id,
    })
    .end();
  response.assertStatus(201);
});

test('it should not be able to register a duplicate question', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const question = await Factory.model('App/Models/Question').make({
    description: 'Comente sobre sua avaliação',
    company_id: company.id,
    created_by: user.id,
  });

  const questionDuplicated = await Factory.model('App/Models/Question').make({
    description: 'Comente sobre sua avaliação',
    company_id: company.id,
    created_by: user.id,
  });

  const response = await client
    .post('/questions')
    .loginVia(user, 'jwt')
    .send(question.toJSON())
    .end();

  response.assertStatus(201);

  const responseDuplicate = await client
    .post('/questions')
    .loginVia(user, 'jwt')
    .send(questionDuplicated.toJSON())
    .end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list questions', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const question = await Factory.model('App/Models/Question').make({ company_id: company.id, created_by: user.id });

  await company.questions().save(question);

  const response = await client
    .get('/questions')
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body[0].description, question.description);
  assert.equal(response.body[0].createdBy.id, user.id);
  assert.equal(response.body[0].companies.name, 'OrangeDev');
});

test('it should be able to show single question', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const question = await Factory.model('App/Models/Question').make({ company_id: company.id, created_by: user.id });

  await company.questions().save(question);

  const response = await client
    .get(`/questions/${question.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body.name, question.name);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, 'OrangeDev');
});

test('it should be able to update question', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const question = await Factory.model('App/Models/Question').make({ company_id: company.id, created_by: user.id });

  await company.questions().save(question);

  const response = await client
    .put(`/questions/${question.id}`)
    .loginVia(user, 'jwt')
    .send({ ...question.toJSON(), description: 'Comenta nada' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.description, 'Comenta nada');
});

test('it should be able to delete question', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const question = await Factory.model('App/Models/Question').make({ company_id: company.id, created_by: user.id });

  await company.questions().save(question);

  const response = await client
    .delete(`/questions/${question.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
  const checkQuestion = await Question.find(question.id);
  assert.isNull(checkQuestion);
});
