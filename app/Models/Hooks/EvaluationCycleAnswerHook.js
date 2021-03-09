/* eslint-disable no-multi-assign */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Notification = use('App/Models/Notification');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

const EvaluationCycleAnswerHook = (exports = module.exports = {});

EvaluationCycleAnswerHook.notifyUser = async (modelInstance) => {
  const user = await User.findOrFail(modelInstance.employee_id);

  const leader = await User.query()
    .where('department_id', user.department_id)
    .whereHas('hierarchies', (builder) => {
      builder.where('level', '01.01.01');
    })
    .first();

  const leaderJson = await leader.toJSON();

  const newNotification = {
    user: leaderJson.id,
    content: `${user.name} iniciou o preenchimento da sua autoavaliação`,
  };

  if (modelInstance.employee_id !== leader.id && modelInstance.employee_id === modelInstance.$sideLoaded.logged_user_id) {
    Notification.findOrCreate(newNotification);
  }
};
