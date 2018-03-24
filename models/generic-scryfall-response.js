'use strict'

function GenericScryfallResponse (scryfallObject) {
  if (!scryfallObject.object) {
    throw new Error('Generic Scryfall response must have an object property')
  }
}

module.exports = GenericScryfallResponse
