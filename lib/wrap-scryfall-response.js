'use strict'

var GenericScryfallResponse = require('../models/generic-scryfall-response')
var models = {
  card: require('../models/card')
}

module.exports = function wrapScryfallResponse(response) {
  var wrappedResponse

  if (typeof response !== 'object') {
    return response
  }

  if (!response.object) {
    wrappedResponse = response
  } else if (response.object in models) {
    wrappedResponse = new models[response.object]
  } else {
    wrappedResponse =  new GenericScryfallResponse(response)
  }

  Object.keys(response).forEach(function (key) {
    wrappedResponse[key] = wrapScryfallResponse(response[key])
  })

  return wrappedResponse
}
