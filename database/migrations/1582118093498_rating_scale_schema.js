'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RatingScaleSchema extends Schema {
  up () {
    this.create('rating_scales', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('rating_scales')
  }
}

module.exports = RatingScaleSchema
