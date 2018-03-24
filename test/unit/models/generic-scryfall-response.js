'use strict'

const GenericScryfallResponse = require('../../../models/generic-scryfall-response')

describe('GenericScryfallResponse', function () {
  it('does not throw for valid response object', function () {
    expect(() => {
      new GenericScryfallResponse({ // eslint-disable-line no-new
        object: 'type'
      })
    }).to.not.throw()
  })

  it('throws an error if there is no object property', function () {
    expect(() => {
      new GenericScryfallResponse({ // eslint-disable-line no-new
        otherProp: 'value'
      })
    }).to.throw('Generic Scryfall response must have an object property')
  })
})
