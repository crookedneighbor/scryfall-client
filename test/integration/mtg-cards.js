const mtgCards = require('../../')

describe('mtgCards', function () {
  describe('rawRequest', function () {
    it('makes a request to scryfall', function () {
      return mtgCards('cards/random').then((res) => {
        expect(res.object).to.equal('card')
      })
    })

    it('handles errors', function () {
      return mtgCards('foo').then(this.expectToReject).catch((error) => {
        expect(error.message).to.be.a('string')
        expect(error.httpStatus).to.equal(404)
      })
    })
  })
})
