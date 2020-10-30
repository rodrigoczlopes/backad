const Hash = use('Hash');

// eslint-disable-next-line no-multi-assign
const EncryptPasswordHook = (exports = module.exports = {});

EncryptPasswordHook.encrypt = async (userInstance) => {
  if (userInstance.dirty.password) {
    userInstance.password = await Hash.make(userInstance.password);
  }
};
