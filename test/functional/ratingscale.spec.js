const { test, trait } = use('Test/Suite')('RatingScale');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const RatingScale = use('App/Models/RatingScale');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

const makeRatingScale = async () => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const ratingScale = {
    name: 'Não atende',
    description:
      'O avaliado não atende aos critérios estabelecidos para o nível ou está mais proximo da atuação esperada para o nível atnterior de complexidade ou, ainda, quando não manifesta as características comportamentais descritas na frase avaliada.',
    company_id: company.id,
    created_by: user.id,
  };
  const ratingScaleMock = await Factory.model('App/Models/RatingScale').make(ratingScale);
  return { ratingScale, ratingScaleMock, user, company };
};

test('it should be able to create rating scale', async ({ client }) => {
  const { user, ratingScale } = await makeRatingScale();
  const response = await client.post('/ratingscales').loginVia(user, 'jwt').send(ratingScale).end();
  response.assertStatus(201);
});

test('it should not be able to register a duplicate rating scale', async ({ client }) => {
  const { user, ratingScale: ratingScaleMock } = await makeRatingScale();
  const ratingScale = await Factory.model('App/Models/RatingScale').make(ratingScaleMock);

  const ratingScaleDuplicated = await Factory.model('App/Models/RatingScale').make(ratingScaleMock);

  const response = await client.post('/ratingscales').loginVia(user, 'jwt').send(ratingScale.toJSON()).end();

  response.assertStatus(201);

  const responseDuplicate = await client.post('/ratingscales').loginVia(user, 'jwt').send(ratingScaleDuplicated.toJSON()).end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list rating scales', async ({ assert, client }) => {
  const { user, company, ratingScaleMock } = await makeRatingScale();

  await company.ratingScales().save(ratingScaleMock);

  const response = await client.get('/ratingscales').loginVia(user, 'jwt').end();

  response.assertStatus(200);

  const { data } = response.body;

  assert.equal(data[0].name, ratingScaleMock.name);
  assert.equal(data[0].createdBy.id, user.id);
  assert.equal(data[0].companies.name, company.name);
});

test('it should be able to show single rating scale', async ({ assert, client }) => {
  const { user, company, ratingScaleMock } = await makeRatingScale();

  await company.ratingScales().save(ratingScaleMock);

  const response = await client.get(`/ratingscales/${ratingScaleMock.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body.name, ratingScaleMock.name);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, company.name);
});

test('it should be able to update rating scale', async ({ assert, client }) => {
  const { user, company, ratingScaleMock } = await makeRatingScale();

  await company.ratingScales().save(ratingScaleMock);

  const response = await client
    .put(`/ratingscales/${ratingScaleMock.id}`)
    .loginVia(user, 'jwt')
    .send({ ...ratingScaleMock.toJSON(), name: 'Supera' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.name, 'Supera');
});

test('it should be able to delete rating scale', async ({ assert, client }) => {
  const { user, company, ratingScaleMock } = await makeRatingScale();

  await company.ratingScales().save(ratingScaleMock);

  const response = await client.delete(`/ratingscales/${ratingScaleMock.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(204);
  const checkRatingScale = await RatingScale.find(ratingScaleMock.id);
  assert.isNull(checkRatingScale);
});
