'use strict'

var GenericScryfallResponse = require('../models/generic-scryfall-response')
// This is a bit of a code smell, but since
// this requires the models to be loaded
// and many of the models require the request
// module, this leads to a cyclical dependency.
// Lazy loading the models within the function
// fixes it. Not perfect, but makes it work.
// https://stackoverflow.com/a/43452583/2601552
var models

module.exports = function wrapScryfallResponse (response) {
  var wrappedResponse

  models = models || {
    card: require('../models/card'),
    list: require('../models/list')
  }

  if (typeof response !== 'object') {
    return response
  }

  if (!response.object) {
    wrappedResponse = response
  } else if (response.object in models) {
    wrappedResponse = new models[response.object](response)
  } else {
    wrappedResponse = new GenericScryfallResponse(response)
  }

  if (response.object === 'list') {
    wrappedResponse.forEach(function (object, location) {
      wrappedResponse[location] = wrapScryfallResponse(object)
    })
  } else {
    Object.keys(response).forEach(function (key) {
      wrappedResponse[key] = wrapScryfallResponse(response[key])
    })
  }

  return wrappedResponse
}
