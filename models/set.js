'use strict'

var request = require('../lib/request')

function Set (scryfallObject) {
  if (scryfallObject.object !== 'set') {
    throw new Error('Object type must be "set"')
  }
}

Set.prototype.getCards = function () {
  return request.rawRequest(this.search_uri)
}

module.exports = Set
