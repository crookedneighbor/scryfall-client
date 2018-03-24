'use strict'

var request = require('../lib/request')

function Card (scryfallObject) {
  if (scryfallObject.object !== 'card') {
    throw new Error('Object type must be "card"')
  }
}

Card.prototype.getRulings = function () {
  return request.rawRequest('cards/' + this.id + '/rulings')
}

module.exports = Card
