const { test, trait } = use('Test/Suite')('RatingScale');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const RatingScale = use('App/Models/RatingScale');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create rating scale', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const response = await client
    .post('/ratingscales')
    .loginVia(user, 'jwt')
    .send({
      name: 'Não atende',
      description:
        'O avaliado não atende aos critérios estabelecidos para o nível ou está mais proximo da atuação esperada para o nível atnterior de complexidade ou, ainda, quando não manifesta as características comportamentais descritas na frase avaliada.',
      company_id: company.id,
      created_by: user.id,
    })
    .end();
  response.assertStatus(201);
});

test('it should not be able to register a duplicate rating scale', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ created_by: user.id });
  const ratingScale = await Factory.model('App/Models/RatingScale').make({
    name: 'Não atende',
    description:
      'O avaliado não atende aos critérios estabelecidos para o nível ou está mais proximo da atuação esperada para o nível atnterior de complexidade ou, ainda, quando não manifesta as características comportamentais descritas na frase avaliada.',
    company_id: company.id,
    created_by: user.id,
  });

  const ratingScaleDuplicated = await Factory.model('App/Models/RatingScale').make({
    name: 'Não atende',
    description:
      'O avaliado não atende aos critérios estabelecidos para o nível ou está mais proximo da atuação esperada para o nível atnterior de complexidade ou, ainda, quando não manifesta as características comportamentais descritas na frase avaliada.',
    company_id: company.id,
    created_by: user.id,
  });

  const response = await client.post('/ratingscales').loginVia(user, 'jwt').send(ratingScale.toJSON()).end();

  response.assertStatus(201);

  const responseDuplicate = await client.post('/ratingscales').loginVia(user, 'jwt').send(ratingScaleDuplicated.toJSON()).end();
  responseDuplicate.assertStatus(400);
});

test('it should be able to list rating scales', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const ratingScale = await Factory.model('App/Models/RatingScale').make({ company_id: company.id, created_by: user.id });

  await company.ratingScales().save(ratingScale);

  const response = await client.get('/ratingscales').loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body[0].name, ratingScale.name);
  assert.equal(response.body[0].createdBy.id, user.id);
  assert.equal(response.body[0].companies.name, 'OrangeDev');
});

test('it should be able to show single rating scale', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const ratingScale = await Factory.model('App/Models/RatingScale').make({ company_id: company.id, created_by: user.id });

  await company.ratingScales().save(ratingScale);

  const response = await client.get(`/ratingscales/${ratingScale.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body.name, ratingScale.name);
  assert.equal(response.body.createdBy.id, user.id);
  assert.equal(response.body.companies.name, 'OrangeDev');
});

test('it should be able to update rating scale', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const ratingScale = await Factory.model('App/Models/RatingScale').make({ company_id: company.id, created_by: user.id });

  await company.ratingScales().save(ratingScale);

  const response = await client
    .put(`/ratingscales/${ratingScale.id}`)
    .loginVia(user, 'jwt')
    .send({ ...ratingScale.toJSON(), name: 'Supera' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.name, 'Supera');
});

test('it should be able to delete rating scale', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const company = await Factory.model('App/Models/Company').create({ name: 'OrangeDev', created_by: user.id });
  const ratingScale = await Factory.model('App/Models/RatingScale').make({ company_id: company.id, created_by: user.id });

  await company.ratingScales().save(ratingScale);

  const response = await client.delete(`/ratingscales/${ratingScale.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(204);
  const checkRatingScale = await RatingScale.find(ratingScale.id);
  assert.isNull(checkRatingScale);
});
