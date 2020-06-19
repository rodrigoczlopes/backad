const { rule } = use('Validator');
const Antl = use('Antl');

class Profile {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      name: [rule('required')],
      email: [rule('email')],
      password: [rule('confirmed')],
      // avatar: [rule('file'), rule('file_ext', ['png', 'jpg', 'jpeg']), rule('file_size', '7mb'), rule('file_types', 'image')],
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = Profile;
