// const Kue = use('Kue');
// const Job = use('App/Jobs/NewPasswordMail');

// class SendPasswordHook {
//   async sendNewPasswordMail(passwordInstance) {
//     try {
//       if (!passwordInstance.dirty.password) return;
//       const { email, name, username, password } = await passwordInstance;

//       Kue.listen();
//       Kue.dispatch(Job.key, { email, name, username, password }, { attempts: 3, priority: 'normal', remove: true });
//     } catch (error) {
//       return error.message;
//     }
//   }
// }

// module.exports = SendPasswordHook;

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
