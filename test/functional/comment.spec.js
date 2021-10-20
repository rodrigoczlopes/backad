const { test, trait } = use('Test/Suite')('Comment');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Comment = use('App/Models/Comment');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

const makeComment = async () => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });

  const comment = {
    description: 'Quais foram as principais contribuições do avaliado no período?',
    company_id: company.id,
    created_by: user.id,
  };

  return { comment, company, user };
};

test('it should be able to create comment', async ({ client }) => {
  const { user, comment } = await makeComment();
  const response = await client.post('/comments').loginVia(user, 'jwt').send(comment).end();
  response.assertStatus(201);
});

test('it should not be able to register a duplicate comment', async ({ client }) => {
  const { user, comment: commentMock } = await makeComment();

  const comment = await Factory.model('App/Models/Comment').make(commentMock);

  const commentDuplicated = await Factory.model('App/Models/Comment').make(commentMock);

  const response = await client.post('/comments').loginVia(user, 'jwt').send(comment.toJSON()).end();

  response.assertStatus(201);

  const responseDuplicate = await client.post('/comments').loginVia(user, 'jwt').send(commentDuplicated.toJSON()).end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list comments', async ({ assert, client }) => {
  const { user, comment: commentMock, company } = await makeComment();
  const comment = await Factory.model('App/Models/Comment').make(commentMock);

  await company.comments().save(comment);

  const response = await client.get('/comments').loginVia(user, 'jwt').end();

  response.assertStatus(200);

  const { data } = response.body;

  assert.equal(data[0].description, comment.description);
  assert.equal(data[0].createdBy.id, user.id);
  assert.equal(data[0].companies.name, company.name);
});

test('it should be able to show single comment', async ({ assert, client }) => {
  const { user, comment: commentMock, company } = await makeComment();
  const comment = await Factory.model('App/Models/Comment').make(commentMock);

  await company.comments().save(comment);

  const response = await client.get(`/comments/${comment.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body.description, comment.description);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, company.name);
});

test('it should be able to update comment', async ({ assert, client }) => {
  const { user, comment: commentMock, company } = await makeComment();
  const comment = await Factory.model('App/Models/Comment').make(commentMock);

  await company.comments().save(comment);

  const response = await client
    .put(`/comments/${comment.id}`)
    .loginVia(user, 'jwt')
    .send({ ...comment.toJSON(), description: 'Comenta nada' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.description, 'Comenta nada');
});

test('it should be able to delete comment', async ({ assert, client }) => {
  const { user, comment: commentMock, company } = await makeComment();
  const comment = await Factory.model('App/Models/Comment').make(commentMock);

  await company.comments().save(comment);

  const response = await client.delete(`/comments/${comment.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(204);
  const checkComment = await Comment.find(comment.id);
  assert.isNull(checkComment);
});
