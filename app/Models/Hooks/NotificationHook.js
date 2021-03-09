/* eslint-disable no-unused-vars */
/* eslint-disable no-multi-assign */
const Ws = use('Ws');

const NotificationHook = (exports = module.exports = {});

NotificationHook.sendWs = async (modelInstance) => {
  const channel = Ws.getChannel('notification:*');
  if (!channel) return;

  const topic = channel.topic(`notification:${modelInstance.user}`);
  if (topic) {
    topic.broadcast('message', modelInstance);
  }
};
