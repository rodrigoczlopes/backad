const Env = use('Env');

module.exports = {
  connection: Env.get('BULL_CONNECTION', 'bull'),
  bull: {
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: null,
      db: 0,
      keyPrefix: 'crescer_bull_',
    },
  },
};
