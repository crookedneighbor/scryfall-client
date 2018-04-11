'use strict'

var makeRequestFunction = require('./lib/request')

function ScryfallClient (options) {
  this.get = makeRequestFunction(options)
}

module.exports = ScryfallClient
