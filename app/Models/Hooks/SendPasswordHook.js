const Bull = use('Rocketseat/Bull');
const Job = use('App/Jobs/NewPasswordMail');

class SendPasswordHook {
  async sendNewPasswordMail(passwordInstance) {
    try {
      if (!passwordInstance.dirty.password) return;
      const { email, name, username, password } = await passwordInstance;

      Bull.add(Job.key, { email, name, username, password });
    } catch (error) {
      return error.message;
    }
  }
}

module.exports = SendPasswordHook;
