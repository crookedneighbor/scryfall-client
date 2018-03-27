'use strict'

const request = require('../../../lib/request')
const Set = require('../../../models/set')
const wrapScryfallResponse = require('../../../lib/wrap-scryfall-response')

describe('Set', function () {
  beforeEach(function () {
    this.sandbox.stub(request, 'rawRequest').resolves({})
  })

  it('does not throw if object type is "set"', function () {
    expect(() => {
      new Set(this.fixtures.set) // eslint-disable-line no-new
    }).to.not.throw()
  })

  it('throws if object type is not "set"', function () {
    expect(() => {
      new Set(this.fixtures.listOfRulings) // eslint-disable-line no-new
    }).to.throw('Object type must be "set"')
  })

  describe('getCards', function () {
    beforeEach(function () {
      request.rawRequest.resolves(wrapScryfallResponse(this.fixtures.listOfCards))
      this.set = wrapScryfallResponse(this.fixtures.set)
    })

    it('gets cards for set', function () {
      return this.set.getCards().then((cards) => {
        expect(this.fixtures.listOfCards.data[0].name).to.be.a('string')
        expect(request.rawRequest).to.be.calledWith(this.fixtures.set.search_uri)
        expect(cards[0].name).to.equal(this.fixtures.listOfCards.data[0].name)
        expect(cards.length).to.equal(this.fixtures.listOfCards.data.length)
      })
    })
  })
})
