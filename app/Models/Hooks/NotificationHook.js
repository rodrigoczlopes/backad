const Ws = use('Ws');

class NotificationHook {
  async sendWs(modelInstance) {
    const channel = Ws.getChannel('notification:*');
    if (!channel) return;

    const topic = channel.topic(`notification:${modelInstance.user}`);
    if (topic) {
      topic.broadcast('message', modelInstance);
    }
  }
}

module.exports = NotificationHook;
