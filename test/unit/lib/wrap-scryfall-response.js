'use strict'

const wrapScryfallResponse = require('../../../lib/wrap-scryfall-response')
const Card = require('../../../models/card')
const Catalog = require('../../../models/catalog')
const List = require('../../../models/list')
const Set = require('../../../models/set')
const GenericScryfallResponse = require('../../../models/generic-scryfall-response')

describe('wrapScryfallResponse', function () {
  beforeEach(function () {
    this.fakeRequestObject = {}
    this.options = {
      requestMethod: this.fakeRequestObject
    }
  })

  it('wraps generic objects with GenericScryfallResponse', function () {
    let wrappedResponse = wrapScryfallResponse({
      object: 'foo',
      foo: 'bar'
    }, this.options)

    expect(wrappedResponse).to.be.an.instanceof(GenericScryfallResponse)
  })

  it('wraps card responses in Card', function () {
    let wrappedResponse = wrapScryfallResponse({
      object: 'card',
      foo: 'bar'
    }, this.options)

    expect(wrappedResponse).to.be.an.instanceof(Card)
    expect(wrappedResponse.foo).to.equal('bar')
  })

  it('wraps list responses in List', function () {
    let wrappedResponse = wrapScryfallResponse({
      object: 'list',
      data: [{
        object: 'card',
        foo: 'bar'
      }, {
        object: 'card',
        foo: 'bar'
      }]
    }, this.options)

    expect(wrappedResponse).to.be.an.instanceof(List)
    expect(wrappedResponse.length).to.equal(2)
    expect(wrappedResponse[0]).to.be.an.instanceof(Card)
  })

  it('wraps catalog responses in cist', function () {
    let wrappedResponse = wrapScryfallResponse({
      object: 'catalog',
      data: [
        'foo',
        'bar'
      ]
    }, this.options)

    expect(wrappedResponse).to.be.an.instanceof(Catalog)
    expect(wrappedResponse.length).to.equal(2)
    expect(wrappedResponse[0]).to.equal('foo')
  })

  it('wraps set responses in Set', function () {
    let wrappedResponse = wrapScryfallResponse({
      object: 'set',
      code: 'DOM'
    }, this.options)

    expect(wrappedResponse).to.be.an.instanceof(Set)
    expect(wrappedResponse.code).to.equal('DOM')
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
    }, this.options)

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
    }, this.options)

    expect(wrappedResponse).to.be.an.instanceof(GenericScryfallResponse)
    expect(wrappedResponse.related_cards[0]).to.be.an.instanceof(Card)
    expect(wrappedResponse.related_cards[1]).to.be.an.instanceof(Card)
    expect(wrappedResponse.nested_thing.more_nesting[0]).to.be.an.instanceof(Card)
  })
})
