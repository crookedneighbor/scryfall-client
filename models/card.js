'use strict'

var request = require('../lib/request')

function Card (scryfallObject) {
  Object.assign(this, scryfallObject)
}

Card.prototype.getRulings = function () {
  return request.rawRequest('cards/' + this.id + '/rulings')
}

module.exports = Card
