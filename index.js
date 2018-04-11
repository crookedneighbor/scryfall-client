'use strict'

var makeRequestFunction = require('./lib/request')

function ScryfallClient (options) {
  this._request = makeRequestFunction(options)
}

ScryfallClient.prototype.get = function () {
  return this._request.apply(this, arguments)
}

module.exports = ScryfallClient
