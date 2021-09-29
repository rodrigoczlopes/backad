const Kue = use('Kue');
const Job = use('App/Jobs/NewPasswordMail');

// eslint-disable-next-line no-multi-assign
const SendPasswordHook = (exports = module.exports = {});

SendPasswordHook.sendNewPasswordMail = async (passwordInstance) => {
  try {
    if (!passwordInstance.dirty.password) return;
    const { email, name, username, password } = await passwordInstance;

    Kue.listen();
    Kue.dispatch(Job.key, { email, name, username, password }, { attempts: 3, priority: 'normal', remove: true });
  } catch (error) {
    return error.message;
  }
};
