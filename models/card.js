'use strict'

// Pulled from https://scryfall.com/docs/api/cards#card-face-objects
// may need to be updated as attributes are added
var CARD_FACE_ATTRIBUTES = [
  'artist',
  'color_indicator',
  'colors',
  'flavor_text',
  'illustration_id',
  'image_uris',
  'loyalty',
  'mana_cost',
  'name',
  'oracle_text',
  'power',
  'printed_name',
  'printed_text',
  'printed_type_line',
  'toughness',
  'type_line',
  'watermark'
]

var SingularEntity = require('./singular-entity')
var basicGetMethods = {
  getRulings: 'rulings_uri',
  getSet: 'set_uri',
  getPrints: 'prints_search_uri'
}

var SCRYFALL_CARD_BACK_IMAGE_URL = 'https://img.scryfall.com/errors/missing.jpg'

function Card (scryfallObject, config) {
  SingularEntity.call(this, scryfallObject, config)

  this.card_faces = scryfallObject.card_faces || [{
    object: 'card_face'
  }]

  this.card_faces.forEach(function (face) {
    CARD_FACE_ATTRIBUTES.forEach(function (attribute) {
      if (attribute in face) {
        return
      }

      if (attribute in scryfallObject) {
        face[attribute] = scryfallObject[attribute]
      }
    })
  })

  this._isDoublesided = scryfallObject.layout === 'transform' || scryfallObject.layout === 'double_faced_token'
}

SingularEntity.setModelName(Card, 'card')

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
  var imageObject = this.card_faces[0].image_uris

  if (!imageObject) {
    throw new Error('Could not find image uris for card.')
  }

  type = type || 'normal'

  if (!(type in imageObject)) {
    throw new Error('`' + type + '` is not a valid type. Must be one of ' + formatKeysForError(imageObject) + '.')
  }

  return imageObject[type]
}

Card.prototype.getBackImage = function (type) {
  var imageObject

  if (!this._isDoublesided) {
    return SCRYFALL_CARD_BACK_IMAGE_URL
  }

  type = type || 'normal'
  imageObject = this.card_faces[1].image_uris

  if (!imageObject) {
    throw new Error('An unexpected error occured when attempting to show back side of card.')
  }

  if (!imageObject[type]) {
    throw new Error('`' + type + '` is not a valid type. Must be one of ' + formatKeysForError(imageObject) + '.')
  }

  return imageObject[type]
}

Card.prototype.getPrice = function (type) {
  var prices = this.prices

  if (!type) {
    return prices.usd || prices.usd_foil || prices.eur || prices.tix || ''
  }

  return prices[type] || ''
}

Card.prototype.getTokens = function () {
  var self = this
  var tokenRequests

  if (!this.all_parts) {
    return Promise.resolve([])
  }

  tokenRequests = this.all_parts.reduce(function (tokens, part) {
    if (part.component === 'token') {
      tokens.push(self._request(part.uri))
    }

    return tokens
  }, [])

  return Promise.all(tokenRequests)
}

Card.prototype.getTaggerUrl = function () {
  return 'https://tagger.scryfall.com/card/' + this.set + '/' + this.collector_number
}

function formatKeysForError (obj) {
  return Object.keys(obj).map(function (key) {
    return '`' + key + '`'
  }).join(', ')
}

module.exports = Card
