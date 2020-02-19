'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FormSchema extends Schema {
  up () {
    this.create('forms', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('forms')
  }
}

module.exports = FormSchema
