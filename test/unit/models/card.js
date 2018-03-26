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

  describe('getSet', function () {
    beforeEach(function () {
      request.rawRequest.resolves(this.fixtures.set)
      this.card = wrapScryfallResponse(this.fixtures.card)
    })

    it('gets set for card', function () {
      return this.card.getSet().then((set) => {
        expect(this.fixtures.card.set_uri).to.be.a('string')
        expect(request.rawRequest).to.be.calledWith(this.fixtures.card.set_uri)
        expect(set.code).to.equal(this.fixtures.set.code)
      })
    })
  })

  describe('getPrints', function () {
    beforeEach(function () {
      request.rawRequest.resolves(wrapScryfallResponse(this.fixtures.listOfPrints))
      this.card = wrapScryfallResponse(this.fixtures.card)
    })

    it('gets prints for card', function () {
      return this.card.getPrints().then((prints) => {
        expect(this.fixtures.listOfPrints.data[0].name).to.be.a('string')
        expect(request.rawRequest).to.be.calledWith(this.fixtures.card.prints_search_uri)
        expect(prints[0].name).to.equal(this.fixtures.listOfPrints.data[0].name)
        expect(prints.length).to.equal(this.fixtures.listOfPrints.data.length)
      })
    })
  })

  describe('isLegal', function () {
    beforeEach(function () {
      this.card = wrapScryfallResponse(this.fixtures.card)
    })

    it('throws an error if no format is provided', function () {
      expect(() => {
        this.card.isLegal()
      }).to.throw('Must provide format for checking legality. Use one of `standard`, `future`, `frontier`, `modern`, `legacy`, `pauper`, `vintage`, `penny`, `commander`, `1v1`, `duel`, `brawl`.')
    })

    it('throws an error if an unrecognized format is provided', function () {
      expect(() => {
        this.card.isLegal('foo')
      }).to.throw('Format "foo" is not recgonized. Use one of `standard`, `future`, `frontier`, `modern`, `legacy`, `pauper`, `vintage`, `penny`, `commander`, `1v1`, `duel`, `brawl`.')
    })

    it('returns true for legal card in provided format', function () {
      this.card.legalities.commander = 'legal'

      expect(this.card.isLegal('commander')).to.equal(true)
    })

    it('returns true for restricted card in provided format', function () {
      this.card.legalities.vintage = 'restricted'

      expect(this.card.isLegal('vintage')).to.equal(true)
    })

    it('returns false for illegal card in provided format', function () {
      this.card.legalities.modern = 'not_legal'

      expect(this.card.isLegal('modern')).to.equal(false)
    })

    it('returns false for banned card in provided format', function () {
      this.card.legalities.legacy = 'banned'

      expect(this.card.isLegal('legacy')).to.equal(false)
    })
  })
})
