const { test, trait } = use('Test/Suite')('Notification');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Notification = use('App/Models/Notification');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

const makeNotification = async () => {
  const user = await Factory.model('App/Models/User').create();

  const notification = {
    user: user.id,
    content: 'Alguma informação aqui',
  };

  const notificationMock = await Factory.model('App/Models/Notification').make(notification);

  return { user, notification, notificationMock };
};

test('it should be able to create a notification', async ({ client }) => {
  const { user, notification } = await makeNotification();
  const response = await client.post('/notifications').loginVia(user, 'jwt').send(notification).end();
  response.assertStatus(201);
});

test('it should be able to list notifications', async ({ assert, client }) => {
  const { user, notificationMock } = await makeNotification();
  await user.notifications().save(notificationMock);

  const response = await client.get('/notifications').loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body[0].content, notificationMock.content);
  assert.equal(response.body[0].users.id, user.id);
});

test('it should be able to show single notification', async ({ assert, client }) => {
  const { user, notificationMock } = await makeNotification();

  await user.notifications().save(notificationMock);

  const response = await client.get(`/notifications/${notificationMock.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.equal(response.body.content, notificationMock.content);
  assert.equal(response.body.users.id, user.id);
});

test('it should be able to update notification', async ({ assert, client }) => {
  const { user, notificationMock } = await makeNotification();

  await user.notifications().save(notificationMock);

  const response = await client
    .put(`/notifications/${notificationMock.id}`)
    .loginVia(user, 'jwt')
    .send({ ...notificationMock.toJSON(), content: 'Você recebeu algo nada a ver' })
    .end();

  response.assertStatus(200);

  assert.equal(response.body.content, 'Você recebeu algo nada a ver');
});

test('it should be able to delete a notification', async ({ assert, client }) => {
  const { user, notificationMock } = await makeNotification();

  await user.notifications().save(notificationMock);

  const response = await client.delete(`/notifications/${notificationMock.id}`).loginVia(user, 'jwt').end();

  response.assertStatus(204);
  const checkNotification = await Notification.find(notificationMock.id);
  assert.isNull(checkNotification);
});
