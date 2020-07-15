class ProgressController {
  constructor({ socket, request }) {
    this.socket = socket;
    this.request = request;
  }

  onProgress(data) {
    console.log(data);
  }
}

module.exports = ProgressController;
