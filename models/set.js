'use strict'

var BaseModel = require('./base-model')

function Set (scryfallObject, requestMethod) {
  BaseModel.call(this, scryfallObject, requestMethod)
}

BaseModel.setModelName(Set, 'set')

Set.prototype.getCards = function () {
  return this._request(this.search_uri)
}

module.exports = Set
