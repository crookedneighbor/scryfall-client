'use strict'

const GenericScryfallResponse = require('../../../models/generic-scryfall-response')

describe('GenericScryfallResponse', function () {
  it('applies properties', function () {
    let response = new GenericScryfallResponse({
      object: 'type',
      foo: 'value',
      fooBar: 'foo'
    })

    expect(response.foo).to.equal('value')
    expect(response.fooBar).to.equal('foo')
  })
})
