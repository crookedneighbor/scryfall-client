'use strict'

var request = require('../lib/request')
var Promise = require('../lib/promise')
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
    throw new Error('Must provide format for checking legality. Use one of ' + formatKeysForError(this.legalities) + '.')
  }

  var legality = this.legalities[format]

  if (!legality) {
    throw new Error('Format "' + format + '" is not recgonized. Use one of ' + formatKeysForError(this.legalities) + '.')
  }

  return legality === 'legal' || legality === 'restricted'
}

Card.prototype.getImage = function (type) {
  var imageObject = this.image_uris || (this.card_faces && this.card_faces[0].image_uris)

  if (!imageObject) {
    return Promise.reject(new Error('Could not find image uris for card.'))
  }

  type = type || 'normal'

  if (!(type in imageObject)) {
    return Promise.reject(new Error('`' + type + '` is not a valid type. Must be one of ' + formatKeysForError(imageObject) + '.'))
  }

  return Promise.resolve(imageObject[type])
}

function formatKeysForError (obj) {
  return Object.keys(obj).map(function (key) {
    return '`' + key + '`'
  }).join(', ')
}


module.exports = Card
