'use strict'

const request = require('../../../lib/request')
const Card = require('../../../models/card')

describe('Card', function () {
  beforeEach(function () {
    this.sandbox.stub(request, 'rawRequest').resolves({})
  })

  it('does not throw if object type is "card"', function () {
    expect(() => {
      new Card(this.fixtures.card)
    }).to.not.throw()
  })

  it('throws if object type is not "card"', function () {
    expect(() => {
      new Card(this.fixtures.listOfRulings)
    }).to.throw('Object type must be "card"')
  })

  describe('getRulings', function () {
    beforeEach(function () {
      request.rawRequest.resolves(this.fixtures.listOfRulings)
    })

    it('gets rulings for card', function () {
      let card = new Card(this.fixtures.card)

      return card.getRulings().then((rulings) => {
        expect(rulings.data[0].comment).to.equal(this.fixtures.listOfRulings.data[0].comment)
      })
    })
  })
})
