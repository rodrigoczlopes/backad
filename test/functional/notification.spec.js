const { test, trait } = use('Test/Suite')('Notification');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Notification = use('App/Models/Notification');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create a notification', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post('/notifications')
    .loginVia(user, 'jwt')
    .send({
      user: user.id,
    })
    .end();

  response.assertStatus(201);
});

test('it should be able to list notifications', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const notification = await Factory.model('App/Models/Notification').make({ user: user.id });

  await user.notifications().save(notification);

  const response = await client
    .get('/notifications')
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);
  assert.equal(response.body[0].content, notification.content);
  assert.equal(response.body[0].users.id, user.id);
});

test('it should be able to show single notification', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const notification = await Factory.model('App/Models/Notification').make({ user: user.id });

  await user.notifications().save(notification);

  const response = await client
    .get(`/notifications/${notification.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body.content, notification.content);
  assert.equal(response.body.users.id, user.id);
});

test('it should be able to update notification', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const notification = await Factory.model('App/Models/Notification').make({ user: user.id });

  await user.notifications().save(notification);

  const response = await client
    .put(`/notifications/${notification.id}`)
    .loginVia(user, 'jwt')
    .send({ ...notification.toJSON(), content: 'Você recebeu algo nada a ver' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.content, 'Você recebeu algo nada a ver');
});

test('it should be able to delete a notification', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const notification = await Factory.model('App/Models/Notification').make({ user: user.id });

  await user.notifications().save(notification);

  const response = await client
    .delete(`/notifications/${notification.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
  const checkNotification = await Notification.find(notification.id);
  assert.isNull(checkNotification);
});
