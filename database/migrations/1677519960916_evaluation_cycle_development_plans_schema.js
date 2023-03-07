'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EvaluationCycleDevelopmentPlansSchema extends Schema {
  up () {
    this.table('evaluation_cycle_development_plans', (table) => {
      table.string('expected');
    })
  }

  down () {
    this.table('evaluation_cycle_development_plans', (table) => {
      table.string('expected');
    })
  }
}

module.exports = EvaluationCycleDevelopmentPlansSchema
