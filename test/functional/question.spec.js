const { test, trait } = use('Test/Suite')('Question');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Question = use('App/Models/Question');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

const makeQuestion = async () => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const question = {
    description: 'Comente sobre sua avaliação',
    company_id: company.id,
    created_by: user.id,
  };
  const questionMock = await Factory.model('App/Models/Question').make(question);
  return { question, user, questionMock, company };
};

test('it should be able to create question', async ({ client }) => {
  const { user, question } = await makeQuestion();
  const response = await client.post('/questions').loginVia(user, 'jwt').send(question).end();
  response.assertStatus(201);
});

test('it should not be able to register a duplicate question', async ({ client }) => {
  const { user, question: questionMock } = await makeQuestion();
  const question = await Factory.model('App/Models/Question').make(questionMock);

  const questionDuplicated = await Factory.model('App/Models/Question').make(questionMock);

  const response = await client.post('/questions').loginVia(user, 'jwt').send(question.toJSON()).end();

  response.assertStatus(201);

  const responseDuplicate = await client.post('/questions').loginVia(user, 'jwt').send(questionDuplicated.toJSON()).end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list questions', async ({ assert, client }) => {
  const { user, questionMock, company } = await makeQuestion();
  await company.questions().save(questionMock);

  const response = await client.get('/questions').loginVia(user, 'jwt').end();

  response.assertStatus(200);

  const { data } = response.body;

  assert.equal(data[0].description, questionMock.description);
  assert.equal(data[0].createdBy.id, user.id);
  assert.equal(data[0].companies.name, company.name);
});

test('it should be able to show single question', async ({ assert, client }) => {
  const { user, questionMock, company } = await makeQuestion();
  await company.questions().save(questionMock);

  const response = await client.get(`/questions/${questionMock.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body.name, questionMock.name);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, company.name);
});

test('it should be able to update question', async ({ assert, client }) => {
  const { user, questionMock, company } = await makeQuestion();
  await company.questions().save(questionMock);

  const response = await client
    .put(`/questions/${questionMock.id}`)
    .loginVia(user, 'jwt')
    .send({ ...questionMock.toJSON(), description: 'Comenta nada' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.description, 'Comenta nada');
});

test('it should be able to delete question', async ({ assert, client }) => {
  const { user, questionMock, company } = await makeQuestion();
  await company.questions().save(questionMock);

  const response = await client.delete(`/questions/${questionMock.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(204);
  const checkQuestion = await Question.find(questionMock.id);
  assert.isNull(checkQuestion);
});
