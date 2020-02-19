'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClassificationSchema extends Schema {
  up () {
    this.create('classifications', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('classifications')
  }
}

module.exports = ClassificationSchema
