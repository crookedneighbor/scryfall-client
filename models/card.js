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

module.exports = Card
