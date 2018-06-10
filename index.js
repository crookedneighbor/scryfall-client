'use strict'

var makeRequestFunction = require('./lib/request')
var wrapScryfallResponse = require('./lib/wrap-scryfall-response')

function ScryfallClient (options) {
  this._request = makeRequestFunction(options)
}

ScryfallClient.prototype.get = function () {
  return this._request.apply(this, arguments)
}

ScryfallClient.prototype.wrap = function (body) {
  return this._request.wrapFunction(body)
}

module.exports = ScryfallClient
