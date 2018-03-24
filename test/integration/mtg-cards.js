const scryfall = require('../../')

describe('scryfallClient', function () {
  describe('rawRequest', function () {
    it('makes a request to scryfall', function () {
      return scryfall('cards/random').then((res) => {
        expect(res.object).to.equal('card')
      })
    })

    it('handles errors', function () {
      return scryfall('foo').then(this.expectToReject).catch((error) => {
        expect(error.message).to.be.a('string')
        expect(error.httpStatus).to.equal(404)
      })
    })
  })
})
