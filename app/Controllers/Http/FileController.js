const Helpers = use('Helpers');

class FileController {
  async show({ params, response }) {
    return response.status(400).json({ message: 'error.message' });
    // return response.download(Helpers.tmpPath(`uploads/${params.file}`));
  }
}

module.exports = FileController;
