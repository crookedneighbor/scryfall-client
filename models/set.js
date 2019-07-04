'use strict'

var BaseModel = require('./base-model')

function Set (scryfallObject, requestMethod) {
  BaseModel.call(this, scryfallObject, requestMethod)
}

Set.SCRYFALL_MODEL_NAME = 'set'
Set.prototype = Object.create(BaseModel.prototype)
Set.prototype.constructor = Set

Set.prototype.getCards = function () {
  return this._request(this.search_uri)
}

module.exports = Set
