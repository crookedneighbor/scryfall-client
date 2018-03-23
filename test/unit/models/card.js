'use strict'

const Card = require('../../../models/card')

describe('Card', function () {
  it('applies properties', function () {
    let card = new Card(this.cardFixture)

    expect(card.name).to.equal(this.cardFixture.name)
  })
})
