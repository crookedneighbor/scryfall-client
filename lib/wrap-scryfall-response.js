'use strict'

var GenericScryfallResponse = require('../models/generic-scryfall-response')
var convertSymbolsToSlackEmoji = require('../lib/convert-symbols-to-slack-emoji')
var models = {
  card: require('../models/card'),
  catalog: require('../models/catalog'),
  list: require('../models/list'),
  set: require('../models/set')
}
module.exports = function wrapScryfallResponse (response, options) {
  var wrappedResponse, requestMethod

  if (options.convertSymbolsToSlackEmoji && typeof response === 'string') {
    response = convertSymbolsToSlackEmoji(response)
  }

  if (typeof response !== 'object') {
    return response
  }

  requestMethod = options.requestMethod

  if (!response.object) {
    wrappedResponse = response
  } else if (response.object in models) {
    wrappedResponse = new models[response.object](response, requestMethod)
  } else {
    wrappedResponse = new GenericScryfallResponse(response, requestMethod)
  }

  if (response.object === 'list') {
    wrappedResponse.forEach(function (object, location) {
      wrappedResponse[location] = wrapScryfallResponse(object, options)
    })
  } else {
    Object.keys(response).forEach(function (key) {
      wrappedResponse[key] = wrapScryfallResponse(response[key], options)
    })
  }

  return wrappedResponse
}
