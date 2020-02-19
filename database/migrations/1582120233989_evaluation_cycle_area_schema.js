'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EvaluationCycleAreaSchema extends Schema {
  up () {
    this.create('evaluation_cycle_areas', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('evaluation_cycle_areas')
  }
}

module.exports = EvaluationCycleAreaSchema
