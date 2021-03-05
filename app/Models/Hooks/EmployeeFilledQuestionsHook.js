/* eslint-disable no-unused-vars */
/* eslint-disable no-multi-assign */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Notification = use('App/Models/Notification');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

const EmployeeFilledQuestionsHook = (exports = module.exports = {});

EmployeeFilledQuestionsHook.method = async (modelInstance) => {};

EmployeeFilledQuestionsHook.notifyUser = async (employeeInteraction) => {
  const user = await User.findOrFail(employeeInteraction.employee_id);
  // Verificar se já há uma notificação para o evaluation cycle
  // Verificar se o user terminou o preenchimento

  const leader = await User.query()
    .where('department_id', user.department_id)
    .whereHas('hierarchies', (builder) => {
      builder.where('level', '01.01.01');
    })
    .first();

  const notifications = await Notification.query()
    .where('user', leader.id)
    .where('content', `${user.name} iniciou o preenchimento da sua autoavaliação`)
    .fetch();

  const notificationJson = await notifications.toJSON();

  if (employeeInteraction.employee_id !== leader.id) {
    if (!notificationJson.length) {
      await Notification.create({
        user: leader.id,
        content: `${user.name} iniciou o preenchimento da sua autoavaliação`,
      });
    }
  }
};
