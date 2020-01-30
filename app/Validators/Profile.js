const Antl = use('Antl');

class Profile {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      name: 'required',
      email: 'email',
      password: 'confirmed',
      avatar: 'file|file_ext:png,jpg,jpeg|file_size:7mb|file_types:image',
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = Profile;
