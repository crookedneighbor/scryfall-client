'use strict'

var GenericScryfallResponse = require('../models/generic-scryfall-response')
var models = {
  card: require('../models/card'),
  catalog: require('../models/catalog'),
  list: require('../models/list'),
  set: require('../models/set')
}
module.exports = function wrapScryfallResponse (response, request) {
  var wrappedResponse

  if (typeof response !== 'object') {
    return response
  }

  if (!response.object) {
    wrappedResponse = response
  } else if (response.object in models) {
    wrappedResponse = new models[response.object](response, request)
  } else {
    wrappedResponse = new GenericScryfallResponse(response, request)
  }

  if (response.object === 'list') {
    wrappedResponse.forEach(function (object, location) {
      wrappedResponse[location] = wrapScryfallResponse(object, request)
    })
  } else {
    Object.keys(response).forEach(function (key) {
      wrappedResponse[key] = wrapScryfallResponse(response[key], request)
    })
  }

  return wrappedResponse
}
