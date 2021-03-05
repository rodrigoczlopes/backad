class NotificationController {
  constructor({ socket, request, auth }) {
    this.socket = socket;
    this.request = request;
    this.auth = auth;
    // console.log(socket);
    // const [, id] = socket.topic.slipt(':');
    // if (id !== auth.user.id) {
    //   socket.close();
    // }
  }
}

module.exports = NotificationController;
