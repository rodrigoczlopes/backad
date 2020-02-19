'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EvaluationCycleLevelSchema extends Schema {
  up () {
    this.create('evaluation_cycle_levels', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('evaluation_cycle_levels')
  }
}

module.exports = EvaluationCycleLevelSchema
