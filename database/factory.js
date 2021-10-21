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
const { v4: uuidv4 } = require('uuid');

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

Factory.blueprint('App/Models/Skill', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    name: faker.sentence({ words: 2 }),
    description: faker.sentence({ words: 20 }),
    active: faker.bool(),
    ...data,
  };
});

Factory.blueprint('App/Models/Behavior', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    description: faker.sentence({ words: 20 }),
    active: faker.bool(),
    ...data,
  };
});

Factory.blueprint('App/Models/DevelopmentPlan', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    action: faker.sentence({ words: 2 }),
    description: faker.sentence({ words: 20 }),
    active: faker.bool(),
    ...data,
  };
});

Factory.blueprint('App/Models/EvaluationCycle', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    description: faker.sentence({ words: 6 }),
    initial_evaluation_period: faker.date(),
    final_evaluation_period: faker.date(),
    initial_manager_feedback: faker.date(),
    final_manager_feedback: faker.date(),
    complexity_level: faker.bool(),
    justificative: faker.bool(),
    comment: faker.bool(),
    make_report_available: faker.integer([1, 5]),
    average_type: faker.integer([1, 5]),
    feedback_type: faker.integer([1, 5]),
    quantity_pair: faker.integer([1, 5]),
    quantity_subordinate: faker.integer([1, 5]),
    quantity_manager: faker.integer([1, 5]),
    quantity_inferior: faker.integer([1, 5]),
    quantity_superior: faker.integer([1, 5]),
    ...data,
  };
});

Factory.blueprint('App/Models/EvaluationCycleLevel', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    ...data,
  };
});

Factory.blueprint('App/Models/EvaluationCycleArea', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    ...data,
  };
});

Factory.blueprint('App/Models/RatingScale', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    name: faker.sentence({ words: 2 }),
    description: faker.sentence({ words: 20 }),
    ...data,
  };
});

Factory.blueprint('App/Models/Question', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    description: faker.sentence({ words: 20 }),
    ...data,
  };
});

Factory.blueprint('App/Models/Comment', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    description: faker.sentence({ words: 20 }),
    ...data,
  };
});

Factory.blueprint('App/Models/Classification', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    description: faker.sentence({ words: 20 }),
    initial_value: faker.floating({ min: 0, max: 3, fixed: 2 }),
    final_value: faker.floating({ min: 0, max: 3, fixed: 2 }),
    ...data,
  };
});

Factory.blueprint('App/Models/Form', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    name: faker.sentence({ words: 2 }),
    observation: faker.sentence({ words: 20 }),
    active: faker.bool(),
    ...data,
  };
});

Factory.blueprint('App/Models/Notification', (faker, i, data = {}) => {
  return {
    id: uuidv4(),
    content: faker.sentence({ words: 5 }),
    read: faker.bool(),
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

Factory.blueprint('App/Models/Role', (faker, i, data = {}) => {
  return {
    id: faker.integer([1, 5]),
    name: faker.sentence({ words: 1 }),
    description: faker.sentence({ words: 1 }),
    slug: faker.sentence({ words: 1 }),
    ...data,
  };
});
