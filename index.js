'use strict'

var request = require('./lib/request').rawRequest

function ScryfallClient () {
  // What config options could we do?
}

ScryfallClient.prototype.get = request

module.exports = ScryfallClient
