'use strict'

const Set = require('../../../models/set')
const wrapScryfallResponse = require('../../../lib/wrap-scryfall-response')

describe('Set', function () {
  beforeEach(function () {
    this.fakeRequestMethod = this.sandbox.stub()
  })

  it('does not throw if object type is "set"', function () {
    expect(() => {
      new Set(this.fixtures.set, this.fakeRequestMethod) // eslint-disable-line no-new
    }).to.not.throw()
  })

  it('throws if object type is not "set"', function () {
    expect(() => {
      new Set(this.fixtures.listOfRulings, this.fakeRequestMethod) // eslint-disable-line no-new
    }).to.throw('Object type must be "set"')
  })

  describe('getCards', function () {
    beforeEach(function () {
      this.fakeRequestMethod.resolves(wrapScryfallResponse(this.fixtures.listOfCards, this.fakeRequestMethod))
      this.set = wrapScryfallResponse(this.fixtures.set, this.fakeRequestMethod)
    })

    it('gets cards for set', function () {
      return this.set.getCards().then((cards) => {
        expect(this.fixtures.listOfCards.data[0].name).to.be.a('string')
        expect(this.fakeRequestMethod).to.be.calledWith(this.fixtures.set.search_uri)
        expect(cards[0].name).to.equal(this.fixtures.listOfCards.data[0].name)
        expect(cards.length).to.equal(this.fixtures.listOfCards.data.length)
      })
    })
  })
})
