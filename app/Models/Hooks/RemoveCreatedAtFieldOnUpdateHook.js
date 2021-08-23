// eslint-disable-next-line no-multi-assign
const RemoveCreatedAtFieldOnUpdateHook = (exports = module.exports = {});

RemoveCreatedAtFieldOnUpdateHook.removeCreatedAt = async (entityInstance) => {
  delete entityInstance.$attributes.created_at;
};
