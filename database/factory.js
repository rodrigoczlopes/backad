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
const uuidv4 = require('uuid/v4');

Factory.blueprint('App/Models/User', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    registry: faker.string({ length: 20 }),
    username: faker.name(),
    name: faker.name(),
    email: faker.email(),
    password: faker.string(),
    cpf: faker.string({ length: 15 }),
    admitted_at: faker.date(),
    active: faker.bool(),
    ...data,
  };
});

Factory.blueprint('App/Models/UserGroup', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    name: faker.sentence({ words: 2 }),
    description: faker.paragraph(),
    ...data,
  };
});

Factory.blueprint('App/Models/Company', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    name: faker.sentence({ words: 2 }),
    code: faker.integer(),
    ...data,
  };
});

Factory.blueprint('App/Models/Department', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    name: faker.sentence({ words: 2 }),
    area_code: faker.integer(),
    level: faker.sentence({ words: 1 }),
    ...data,
  };
});

Factory.blueprint('App/Models/Path', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    description: faker.sentence({ words: 2 }),
    ...data,
  };
});

Factory.blueprint('App/Models/Position', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    description: faker.sentence({ words: 2 }),
    position_code: faker.integer(),
    ...data,
  };
});

Factory.blueprint('App/Models/Hierarchy', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    description: faker.sentence({ words: 2 }),
    level: faker.sentence({ words: 1 }),
    active: faker.bool(),
    ...data,
  };
});

Factory.blueprint('App/Models/Token', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    type: data.type || 'forgotpassword',
    token: faker.string({ length: 20 }),
    ...data,
  };
});
