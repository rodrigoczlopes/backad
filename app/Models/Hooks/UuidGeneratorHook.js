const { v4: uuidv4 } = require('uuid');

// eslint-disable-next-line no-multi-assign
const UuidGeneratorHook = (exports = module.exports = {});

UuidGeneratorHook.uuid = async (model) => {
  model.id = uuidv4();
};
