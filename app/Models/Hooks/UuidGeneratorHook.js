const { v4: uuidv4 } = require('uuid');

class UuidGeneratorHook {
  async uuid(model) {
    model.id = uuidv4().toUpperCase();
  }
}

module.exports = UuidGeneratorHook;
