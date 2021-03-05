/* eslint-disable no-unused-vars */
/* eslint-disable no-multi-assign */
const Ws = use('Ws');

const NotificationHook = (exports = module.exports = {});

NotificationHook.method = async (modelInstance) => {};

NotificationHook.sendWs = async (notification) => {
  const channel = Ws.getChannel('notification:*');
  if (!channel) return;

  const topic = channel.topic(`notification:${notification.user}`);
  if (topic) {
    topic.broadcast('message', notification);
  }
};
