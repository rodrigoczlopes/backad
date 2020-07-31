const { v4: uuidv4 } = require('uuid');

const UuidGeneratorHook = (exports = module.exports = {});

UuidGeneratorHook.uuid = async (model) => {
  model.id = uuidv4();
};
