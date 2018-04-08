'use strict'

var ArrayLike = require('./array-like')

function Catalog (scryfallObject) {
  var arr = ArrayLike.call(this, scryfallObject)

  arr.__proto__ = Catalog.prototype // eslint-disable-line no-proto

  return arr
}

Catalog.prototype = Object.create(ArrayLike.prototype)
Catalog.prototype.constructor = Catalog

module.exports = Catalog
