'use strict'

var request = require('../lib/request')
var basicGetMethods = {
  getRulings: 'rulings_uri',
  getSet: 'set_uri',
  getPrints: 'prints_search_uri'
}

function Card (scryfallObject) {
  if (scryfallObject.object !== 'card') {
    throw new Error('Object type must be "card"')
  }
}

Object.keys(basicGetMethods).forEach(function (method) {
  Card.prototype[method] = function () {
    return request.rawRequest(this[basicGetMethods[method]])
  }
})

Card.prototype.isLegal = function (format) {
  if (!format) {
    throw new Error('Must provide format for checking legality. Use one of ' + this._getLegalities() + '.')
  }

  var legality = this.legalities[format]

  if (!legality) {
    throw new Error('Format "' + format + '" is not recgonized. Use one of ' + this._getLegalities() + '.')
  }

  return legality === 'legal' || legality === 'restricted'
}

Card.prototype._getLegalities = function () {
  return Object.keys(this.legalities).map(function (key) {
    return '`' + key + '`'
  }).join(', ')
}

module.exports = Card
