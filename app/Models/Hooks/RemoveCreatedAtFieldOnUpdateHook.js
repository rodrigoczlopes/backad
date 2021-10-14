class RemoveCreatedAtFieldOnUpdateHook {
  async removeCreatedAt(entityInstance) {
    delete entityInstance.$attributes.created_at;
  }
}

module.exports = RemoveCreatedAtFieldOnUpdateHook;
