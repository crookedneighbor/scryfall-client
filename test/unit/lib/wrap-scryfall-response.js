'use strict'

const wrapScryfallResponse = require('../../../lib/wrap-scryfall-response')
const Card = require('../../../models/card')
const GenericScryfallResponse = require('../../../models/generic-scryfall-response')

describe('wrapScryfallResponse', function () {
  it('wraps generic objects with GenericScryfallResponse', function () {
    let wrappedResponse = wrapScryfallResponse({
      object: 'foo',
      foo: 'bar'
    })

    expect(wrappedResponse).to.be.an.instanceof(GenericScryfallResponse)
  })

  it('wraps card responses in Card', function () {
    let wrappedResponse = wrapScryfallResponse({
      object: 'card',
      foo: 'bar'
    })

    expect(wrappedResponse).to.be.an.instanceof(Card)
    expect(wrappedResponse.foo).to.equal('bar')
  })

  it('wraps nested properties', function () {
    let wrappedResponse = wrapScryfallResponse({
      object: 'foo',
      foo: 'bar',
      related_card: {
        object: 'card',
        foo: 'bar'
      },
      nested_thing: {
        more_nesting: {
          object: 'card',
          foo: 'bar'
        }
      }
    })

    expect(wrappedResponse).to.be.an.instanceof(GenericScryfallResponse)
    expect(wrappedResponse.related_card).to.be.an.instanceof(Card)
    expect(wrappedResponse.nested_thing.more_nesting).to.be.an.instanceof(Card)
  })

  it('wraps objects in an array', function () {
    let wrappedResponse = wrapScryfallResponse({
      object: 'foo',
      foo: 'bar',
      related_cards: [{
        object: 'card',
        foo: 'bar'
      }, {
        object: 'card',
        foo: 'baz'
      }],
      nested_thing: {
        more_nesting: [{
          object: 'card',
          foo: 'bar'
        }]
      }
    })

    expect(wrappedResponse).to.be.an.instanceof(GenericScryfallResponse)
    expect(wrappedResponse.related_cards[0]).to.be.an.instanceof(Card)
    expect(wrappedResponse.related_cards[1]).to.be.an.instanceof(Card)
    expect(wrappedResponse.nested_thing.more_nesting[0]).to.be.an.instanceof(Card)
  })
})
