const Hash = use('Hash');

class EncryptPasswordHook {
  async encrypt(userInstance) {
    if (userInstance.dirty.password) {
      userInstance.password = await Hash.make(userInstance.password);
    }
  }
}

module.exports = EncryptPasswordHook;
