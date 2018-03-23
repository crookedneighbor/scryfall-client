'use strict'

const request = require('../../../lib/request')
const Card = require('../../../models/card')

describe('Card', function () {
  beforeEach(function () {
    this.sandbox.stub(request, 'rawRequest').resolves({})
  })

  it('applies properties', function () {
    let card = new Card(this.fixtures.card)

    expect(card.name).to.equal(this.fixtures.card.name)
  })

  describe('getRulings', function () {
    beforeEach(function () {
      request.rawRequest.resolves(this.fixtures.rulings)
    })

    it('gets rulings for card', function () {
      let card = new Card(this.fixtures.card)

      return card.getRulings().then((rulings) => {
        expect(rulings.data[0].comment).to.equal(this.fixtures.rulings.data[0].comment)
      })
    })
  })
})
