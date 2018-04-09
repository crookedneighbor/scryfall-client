'use strict'

function Set (scryfallObject, requestMethod) {
  if (scryfallObject.object !== 'set') {
    throw new Error('Object type must be "set"')
  }

  this._request = requestMethod
}

Set.prototype.getCards = function () {
  return this._request(this.search_uri)
}

module.exports = Set
