'use strict'

var Promise = require('../lib/promise')
var basicGetMethods = {
  getRulings: 'rulings_uri',
  getSet: 'set_uri',
  getPrints: 'prints_search_uri'
}

var SCRYFALL_CARD_BACK_IMAGE_URL = 'https://img.scryfall.com/errors/missing.jpg'

function Card (scryfallObject, requestMethod) {
  if (scryfallObject.object !== 'card') {
    throw new Error('Object type must be "card"')
  }

  this._request = requestMethod
}

Object.keys(basicGetMethods).forEach(function (method) {
  Card.prototype[method] = function () {
    return this._request(this[basicGetMethods[method]])
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

Card.prototype.getBackImage = function (type) {
  var cardImage, imageObject
  var self = this

  type = type || 'normal'

  if (this.layout === 'meld') {
    var promises = findMeldUrls(this).map(function (url) {
      return self._request(url).then(function (card) {
        return card.image_uris[type]
      })
    })

    return Promise.all(promises)
  }

  if (this.image_uris) {
    cardImage = SCRYFALL_CARD_BACK_IMAGE_URL
  } else if (this.card_faces) {
    imageObject = this.card_faces[1].image_uris

    if (!imageObject[type]) {
      return Promise.reject(new Error('`' + type + '` is not a valid type. Must be one of ' + formatKeysForError(imageObject) + '.'))
    }
    cardImage = imageObject[type]
  }

  if (!cardImage) {
    return Promise.reject(new Error('An unexpected error occured when attempting to show back side of card.'))
  }

  return Promise.resolve([cardImage])
}

function findMeldUrls (card) {
  var cardIsBackSide = card.collector_number.indexOf('b') > -1
  var cards

  if (cardIsBackSide) {
    cards = card.all_parts.filter(function (part) {
      return part.name !== card.name
    })
  } else {
    cards = [card.all_parts.find(function (part) {
      return part.uri.match(/b$/)
    })]
  }

  return cards.map(function (part) {
    return part.uri
  })
}

function formatKeysForError (obj) {
  return Object.keys(obj).map(function (key) {
    return '`' + key + '`'
  }).join(', ')
}

module.exports = Card
