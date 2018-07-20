'use strict'

var makeRequestFunction = require('./lib/request')
var symbols = require('./lib/symbols')

function ScryfallClient (options) {
  this._request = makeRequestFunction(options)
}

ScryfallClient.symbols = symbols

ScryfallClient.prototype.get = function () {
  return this._request.apply(this, arguments)
}

ScryfallClient.prototype.wrap = function (body) {
  return this._request.wrapFunction(body)
}

module.exports = ScryfallClient
