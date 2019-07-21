'use strict'

var SingularEntity = require('./singular-entity')

function Set (scryfallObject, config) {
  SingularEntity.call(this, scryfallObject, config)
}

SingularEntity.setModelName(Set, 'set')

Set.prototype.getCards = function () {
  return this._request(this.search_uri)
}

module.exports = Set
