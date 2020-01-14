/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

Factory.blueprint('App/Models/User', (faker, i, data = {}) => {
  return {
    registry: faker.integer(),
    username: faker.name(),
    name: faker.name(),
    email: faker.email(),
    password: faker.string(),
    cpf: faker.integer(),
    admitted_at: faker.date(),
    fired_at: faker.date(),
    deleted_at: faker.date(),
    ...data,
  };
});

Factory.blueprint('App/Models/Token', (faker, i, data = {}) => {
  return {
    type: data.type || 'forgotpassword',
    token: faker.string({ length: 20 }),
    ...data,
  };
});
