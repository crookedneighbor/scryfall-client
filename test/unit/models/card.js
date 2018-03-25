'use strict'

const request = require('../../../lib/request')
const Card = require('../../../models/card')
const wrapScryfallResponse = require('../../../lib/wrap-scryfall-response')

describe('Card', function () {
  beforeEach(function () {
    this.sandbox.stub(request, 'rawRequest').resolves({})
  })

  it('does not throw if object type is "card"', function () {
    expect(() => {
      new Card(this.fixtures.card) // eslint-disable-line no-new
    }).to.not.throw()
  })

  it('throws if object type is not "card"', function () {
    expect(() => {
      new Card(this.fixtures.listOfRulings) // eslint-disable-line no-new
    }).to.throw('Object type must be "card"')
  })

  describe('getRulings', function () {
    beforeEach(function () {
      request.rawRequest.resolves(this.fixtures.listOfRulings)
      this.card = wrapScryfallResponse(this.fixtures.card)
    })

    it('gets rulings for card', function () {
      return this.card.getRulings().then((rulings) => {
        expect(this.fixtures.card.rulings_uri).to.be.a('string')
        expect(request.rawRequest).to.be.calledWith(this.fixtures.card.rulings_uri)
        expect(rulings.data[0].comment).to.equal(this.fixtures.listOfRulings.data[0].comment)
      })
    })
  })
})
