const { ServiceProvider } = require('@adonisjs/fold');

class CustomValidationProvider extends ServiceProvider {
  async existsFn(data, field, message, args, get) {
    const Database = use('Database');
    const value = get(data, field);
    if (!value) {
      return;
    }
    const [table, column] = args;
    const row = await Database.table(table)
      .where(column, value)
      .first();
    if (!row) {
      throw message;
    }
  }

  async unique_combinationFn(data, field, message, args, get) { // eslint-disable-line
    const Database = use('Database');
    const value = get(data, field);
    if (!value) {
      return;
    }
    const [table, column] = args;
    const row = data.id
      ? await Database.table(table)
          .where(field, value)
          .where(column, data[column])
          .whereNot('id', data.id)
          .first()
      : await Database.table(table)
          .where(field, value)
          .where(column, data[column])
          .first();
    if (row) {
      throw message;
    }
  }

  boot() {
    const Validator = use('Validator');
    Validator.extend('exists', this.existsFn.bind(this));
    Validator.extend('uniqueCombination', this.unique_combinationFn.bind(this));
  }
}

module.exports = CustomValidationProvider;
