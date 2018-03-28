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

  describe('getImage', function () {
    it('resolves with the specified image format for normal layout cards', function () {
      let card = wrapScryfallResponse(this.fixtures.card)

      return card.getImage('normal').then((img) => {
        expect(img).to.be.a('string')
        expect(img).to.equal(this.fixtures.card.image_uris.normal)

        return card.getImage('small')
      }).then((img) => {
        expect(img).to.be.a('string')
        expect(img).to.equal(this.fixtures.card.image_uris.small)
      })
    })

    it('defaults to normal layout', function () {
      let card = wrapScryfallResponse(this.fixtures.card)

      return card.getImage().then((img) => {
        expect(img).to.be.a('string')
        expect(img).to.equal(this.fixtures.card.image_uris.normal)
      })
    })

    it('rejects with an error if image type does not exist', function () {
      let card = wrapScryfallResponse(this.fixtures.card)

      return card.getImage('foo').then(this.expectToReject).catch((err) => {
        expect(err.message).to.equal('`foo` is not a valid type. Must be one of `small`, `normal`, `large`, `png`, `art_crop`, `border_crop`.')
      })
    })

    it('uses default face for transform card', function () {
      let card = wrapScryfallResponse(this.fixtures.cardWithTransformLayout)

      return card.getImage().then((img) => {
        expect(img).to.be.a('string')
        expect(img).to.equal(this.fixtures.cardWithTransformLayout.card_faces[0].image_uris.normal)
      })
    })

    it('gets image for flip card', function () {
      let card = wrapScryfallResponse(this.fixtures.cardWithFlipLayout)

      return card.getImage().then((img) => {
        expect(img).to.be.a('string')
        expect(img).to.equal(this.fixtures.cardWithFlipLayout.image_uris.normal)
      })
    })

    it('gets image for meld card', function () {
      let card = wrapScryfallResponse(this.fixtures.cardWithMeldLayout)

      return card.getImage().then((img) => {
        expect(img).to.be.a('string')
        expect(img).to.equal(this.fixtures.cardWithMeldLayout.image_uris.normal)
      })
    })

    it('rejects with an error if image uris cannot be found', function () {
      let card = wrapScryfallResponse(this.fixtures.cardWithTransformLayout)

      delete card.card_faces

      return card.getImage().then(this.expectToReject).catch((err) => {
        expect(err.message).to.equal('Could not find image uris for card.')
      })
    })
  })

  describe('getBackImage', function () {
    it('resolves with scryfall back image for normal layout cards', function () {
      let card = wrapScryfallResponse(this.fixtures.card)

      return card.getBackImage().then((imgs) => {
        expect(imgs).to.be.a('array')
        expect(imgs.length).to.equal(1)
        expect(imgs[0]).to.equal('https://img.scryfall.com/errors/missing.jpg')
      })
    })

    it('resolves with the same scryfall back image for normal layout cards regardless of type passed in', function () {
      let card = wrapScryfallResponse(this.fixtures.card)

      return card.getBackImage('normal').then((imgs) => {
        expect(imgs).to.be.a('array')
        expect(imgs.length).to.equal(1)
        expect(imgs[0]).to.equal('https://img.scryfall.com/errors/missing.jpg')

        return card.getBackImage('small')
      }).then((imgs) => {
        expect(imgs).to.be.a('array')
        expect(imgs.length).to.equal(1)
        expect(imgs[0]).to.equal('https://img.scryfall.com/errors/missing.jpg')
      })
    })

    it('rejects with an error if image type does not exist', function () {
      let card = wrapScryfallResponse(this.fixtures.cardWithTransformLayout)

      return card.getBackImage('foo').then(this.expectToReject).catch((err) => {
        expect(err.message).to.equal('`foo` is not a valid type. Must be one of `small`, `normal`, `large`, `png`, `art_crop`, `border_crop`.')
      })
    })

    it('rejects with an error if card does not have image uris or card faces', function () {
      let card = wrapScryfallResponse(this.fixtures.cardWithTransformLayout)

      delete card.card_faces

      return card.getBackImage().then(this.expectToReject).catch((err) => {
        expect(err.message).to.equal('An unexpected error occured when attempting to show back side of card.')
      })
    })

    it('uses back face for transform card', function () {
      let card = wrapScryfallResponse(this.fixtures.cardWithTransformLayout)

      return card.getBackImage().then((imgs) => {
        expect(imgs).to.be.a('array')
        expect(imgs.length).to.equal(1)
        expect(imgs[0]).to.equal(this.fixtures.cardWithTransformLayout.card_faces[1].image_uris.normal)
      })
    })

    it('can specify size for back face for transform card', function () {
      let card = wrapScryfallResponse(this.fixtures.cardWithTransformLayout)

      return card.getBackImage('small').then((imgs) => {
        expect(imgs).to.be.a('array')
        expect(imgs.length).to.equal(1)
        expect(imgs[0]).to.equal(this.fixtures.cardWithTransformLayout.card_faces[1].image_uris.small)
      })
    })

    it('gives the back card image for flip card', function () {
      let card = wrapScryfallResponse(this.fixtures.cardWithFlipLayout)

      return card.getBackImage().then((imgs) => {
        expect(imgs).to.be.a('array')
        expect(imgs.length).to.equal(1)
        expect(imgs[0]).to.equal('https://img.scryfall.com/errors/missing.jpg')
      })
    })

    it('gets melded card image for meld card', function () {
      let card = wrapScryfallResponse(this.fixtures.cardWithMeldLayout)

      request.rawRequest.resolves(wrapScryfallResponse(this.fixtures.cardBackWithMeldLayout))

      return card.getBackImage().then((imgs) => {
        expect(imgs).to.be.a('array')
        expect(imgs.length).to.equal(1)
        expect(imgs[0]).to.equal(this.fixtures.cardBackWithMeldLayout.image_uris.normal)
      })
    })

    it('gets unmeleded card images for backside of meld card', function () {
      let card = wrapScryfallResponse(this.fixtures.cardBackWithMeldLayout)

      request.rawRequest.withArgs(this.fixtures.cardBackWithMeldLayout.all_parts[0].uri).resolves(wrapScryfallResponse(this.fixtures.cardWithMeldLayout))
      request.rawRequest.withArgs(this.fixtures.cardBackWithMeldLayout.all_parts[2].uri).resolves(wrapScryfallResponse(this.fixtures.secondCardWithMeldLayout))

      return card.getBackImage().then((imgs) => {
        expect(imgs).to.be.a('array')
        expect(imgs.length).to.equal(2)
        expect(imgs[0]).to.equal(this.fixtures.cardWithMeldLayout.image_uris.normal)
        expect(imgs[1]).to.equal(this.fixtures.secondCardWithMeldLayout.image_uris.normal)
      })
    })
  })
})
