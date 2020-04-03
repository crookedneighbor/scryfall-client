'use strict'

const Card = require('../../../models/card')
const wrapScryfallResponse = require('../../../lib/wrap-scryfall-response')

describe.only('Card', function () {
  beforeEach(function () {
    this.fakeRequestMethod = this.sandbox.stub()
    this.config = {
      requestMethod: this.fakeRequestMethod
    }
  })

  it('does not throw if object type is "card"', function () {
    expect(() => {
      new Card(this.fixtures.card, this.config) // eslint-disable-line no-new
    }).to.not.throw()
  })

  it('throws if object type is not "card"', function () {
    expect(() => {
      new Card(this.fixtures.listOfRulings, this.config) // eslint-disable-line no-new
    }).to.throw('Object type must be "card"')
  })

  it('normalizes card faces', function () {
    const cardWithoutFaces = wrapScryfallResponse(this.fixtures.card, {
      requestMethod: this.fakeRequestMethod
    })
    const cardWithFaces = wrapScryfallResponse(this.fixtures.cardWithTransformLayout, {
      requestMethod: this.fakeRequestMethod
    })

    expect(cardWithoutFaces.card_faces).to.not.equal(this.fixtures.card.card_faces)
    expect(cardWithoutFaces.card_faces.length).to.equal(1)
    expect(cardWithoutFaces.card_faces[0]).to.deep.equal({
      object: 'card_face',
      name: cardWithoutFaces.name,
      mana_cost: cardWithoutFaces.mana_cost,
      flavor_text: cardWithoutFaces.flavor_text,
      colors: cardWithoutFaces.colors,
      oracle_text: cardWithoutFaces.oracle_text,
      type_line: cardWithoutFaces.type_line,
      artist: cardWithoutFaces.artist,
      image_uris: cardWithoutFaces.image_uris,
      illustration_id: cardWithoutFaces.illustration_id
    })

    expect(cardWithFaces.card_faces.length).to.equal(2)
    expect(cardWithFaces.card_faces).to.equal(this.fixtures.cardWithTransformLayout.card_faces)
  })

  describe('getRulings', function () {
    beforeEach(function () {
      this.fakeRequestMethod.resolves(this.fixtures.listOfRulings)
      this.card = wrapScryfallResponse(this.fixtures.card, {
        requestMethod: this.fakeRequestMethod
      })
    })

    it('gets rulings for card', function () {
      return this.card.getRulings().then((rulings) => {
        expect(this.fixtures.card.rulings_uri).to.be.a('string')
        expect(this.fakeRequestMethod).to.be.calledWith(this.fixtures.card.rulings_uri)
        expect(rulings.data[0].comment).to.equal(this.fixtures.listOfRulings.data[0].comment)
      })
    })
  })

  describe('getSet', function () {
    beforeEach(function () {
      this.fakeRequestMethod.resolves(this.fixtures.set)
      this.card = wrapScryfallResponse(this.fixtures.card, {
        requestMethod: this.fakeRequestMethod
      })
    })

    it('gets set for card', function () {
      return this.card.getSet().then((set) => {
        expect(this.fixtures.card.set_uri).to.be.a('string')
        expect(this.fakeRequestMethod).to.be.calledWith(this.fixtures.card.set_uri)
        expect(set.code).to.equal(this.fixtures.set.code)
      })
    })
  })

  describe('getPrints', function () {
    beforeEach(function () {
      this.fakeRequestMethod.resolves(wrapScryfallResponse(this.fixtures.listOfPrints, {
        requestMethod: this.fakeRequestMethod
      }))
      this.card = wrapScryfallResponse(this.fixtures.card, {
        requestMethod: this.fakeRequestMethod
      })
    })

    it('gets prints for card', function () {
      return this.card.getPrints().then((prints) => {
        expect(this.fixtures.listOfPrints.data[0].name).to.be.a('string')
        expect(this.fakeRequestMethod).to.be.calledWith(this.fixtures.card.prints_search_uri)
        expect(prints[0].name).to.equal(this.fixtures.listOfPrints.data[0].name)
        expect(prints.length).to.equal(this.fixtures.listOfPrints.data.length)
      })
    })
  })

  describe('isLegal', function () {
    beforeEach(function () {
      this.card = wrapScryfallResponse(this.fixtures.card, {
        requestMethod: this.fakeRequestMethod
      })
    })

    it('throws an error if no format is provided', function () {
      expect(() => {
        this.card.isLegal()
      }).to.throw('Must provide format for checking legality. Use one of `standard`, `future`, `frontier`, `modern`, `legacy`, `pauper`, `vintage`, `penny`, `commander`, `duel`, `oldschool`.')
    })

    it('throws an error if an unrecognized format is provided', function () {
      expect(() => {
        this.card.isLegal('foo')
      }).to.throw('Format "foo" is not recgonized. Use one of `standard`, `future`, `frontier`, `modern`, `legacy`, `pauper`, `vintage`, `penny`, `commander`, `duel`, `oldschool`.')
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
    it('returns with the specified image format for normal layout cards', function () {
      const card = wrapScryfallResponse(this.fixtures.card, {
        requestMethod: this.fakeRequestMethod
      })

      let img = card.getImage('normal')
      expect(img).to.be.a('string')
      expect(img).to.equal(this.fixtures.card.image_uris.normal)

      img = card.getImage('small')
      expect(img).to.be.a('string')
      expect(img).to.equal(this.fixtures.card.image_uris.small)
    })

    it('defaults to normal layout', function () {
      const card = wrapScryfallResponse(this.fixtures.card, {
        requestMethod: this.fakeRequestMethod
      })

      const img = card.getImage()
      expect(img).to.equal(this.fixtures.card.image_uris.normal)
    })

    it('throws an error if image type does not exist', function () {
      const card = wrapScryfallResponse(this.fixtures.card, {
        requestMethod: this.fakeRequestMethod
      })

      expect(() => {
        card.getImage('foo')
      }).to.throw('`foo` is not a valid type. Must be one of `small`, `normal`, `large`, `png`, `art_crop`, `border_crop`.')
    })

    it('uses default face for transform card', function () {
      const card = wrapScryfallResponse(this.fixtures.cardWithTransformLayout, {
        requestMethod: this.fakeRequestMethod
      })

      const img = card.getImage()
      expect(img).to.be.a('string')
      expect(img).to.equal(this.fixtures.cardWithTransformLayout.card_faces[0].image_uris.normal)
    })

    it('gets image for flip card', function () {
      const card = wrapScryfallResponse(this.fixtures.cardWithFlipLayout, {
        requestMethod: this.fakeRequestMethod
      })

      const img = card.getImage()
      expect(img).to.be.a('string')
      expect(img).to.equal(this.fixtures.cardWithFlipLayout.image_uris.normal)
    })

    it('gets image for meld card', function () {
      const card = wrapScryfallResponse(this.fixtures.cardWithMeldLayout, {
        requestMethod: this.fakeRequestMethod
      })

      const img = card.getImage()
      expect(img).to.be.a('string')
      expect(img).to.equal(this.fixtures.cardWithMeldLayout.image_uris.normal)
    })

    it('rejects with an error if image uris cannot be found', function () {
      const card = wrapScryfallResponse(this.fixtures.cardWithTransformLayout, {
        requestMethod: this.fakeRequestMethod
      })

      const originalImgUris = card.card_faces[0].image_uris
      delete card.card_faces[0].image_uris

      expect(() => {
        card.getImage()
      }).to.throw('Could not find image uris for card.')

      card.card_faces[0].image_uris = originalImgUris
    })
  })

  describe('getBackImage', function () {
    it('returns with scryfall back image for normal layout cards', function () {
      const card = wrapScryfallResponse(this.fixtures.card, {
        requestMethod: this.fakeRequestMethod
      })

      const img = card.getBackImage()
      expect(img).to.equal('https://img.scryfall.com/errors/missing.jpg')
    })

    it('returns with the same scryfall back image for normal layout cards regardless of type passed in', function () {
      const card = wrapScryfallResponse(this.fixtures.card, {
        requestMethod: this.fakeRequestMethod
      })

      let img = card.getBackImage('normal')
      expect(img).to.equal('https://img.scryfall.com/errors/missing.jpg')

      img = card.getBackImage('small')
      expect(img).to.equal('https://img.scryfall.com/errors/missing.jpg')
    })

    it('rejects with an error if image type does not exist', function () {
      const card = wrapScryfallResponse(this.fixtures.cardWithTransformLayout, {
        requestMethod: this.fakeRequestMethod
      })

      expect(() => {
        card.getBackImage('foo')
      }).to.throw('`foo` is not a valid type. Must be one of `small`, `normal`, `large`, `png`, `art_crop`, `border_crop`.')
    })

    it('rejects with an error if card does not have image uris', function () {
      const card = wrapScryfallResponse(this.fixtures.cardWithTransformLayout, {
        requestMethod: this.fakeRequestMethod
      })
      const oldImageUris = card.card_faces[1].image_uris

      delete card.card_faces[1].image_uris

      expect(() => {
        card.getBackImage()
      }).to.throw('An unexpected error occured when attempting to show back side of card.')

      card.card_faces[1].image_uris = oldImageUris
    })

    it('uses back face for transform card', function () {
      const card = wrapScryfallResponse(this.fixtures.cardWithTransformLayout, {
        requestMethod: this.fakeRequestMethod
      })

      const img = card.getBackImage()
      expect(img).to.equal(this.fixtures.cardWithTransformLayout.card_faces[1].image_uris.normal)
    })

    it('can specify size for back face for transform card', function () {
      const card = wrapScryfallResponse(this.fixtures.cardWithTransformLayout, {
        requestMethod: this.fakeRequestMethod
      })

      const img = card.getBackImage('small')
      expect(img).to.equal(this.fixtures.cardWithTransformLayout.card_faces[1].image_uris.small)
    })

    it('gives the back card image for flip card', function () {
      const card = wrapScryfallResponse(this.fixtures.cardWithFlipLayout, {
        requestMethod: this.fakeRequestMethod
      })

      const img = card.getBackImage()
      expect(img).to.equal('https://img.scryfall.com/errors/missing.jpg')
    })
  })

  describe('getPrice', function () {
    beforeEach(function () {
      this.card = wrapScryfallResponse(this.fixtures.card, {
        requestMethod: this.fakeRequestMethod
      })
      this.originalPrices = Object.assign({}, this.fixtures.card.prices)

      Object.keys(this.originalPrices).forEach((priceKind) => {
        // ensure that each price type in fixture exists
        expect(Boolean(this.originalPrices[priceKind])).to.equal(true)
      })
    })

    afterEach(function () {
      this.fixtures.card.prices = this.originalPrices
    })

    it('returns the non-foil usd price when no arguments are given', function () {
      expect(this.card.getPrice()).to.equal(this.originalPrices.usd)
    })

    it('returns the specified version if given', function () {
      expect(this.card.getPrice('eur')).to.equal(this.originalPrices.eur)
    })

    it('returns the foil price if no usd price is available and no argument is given', function () {
      this.card.prices.usd = null

      expect(this.card.getPrice()).to.equal(this.originalPrices.usd_foil)
    })

    it('returns the eur price if no usd or foil price available', function () {
      this.card.prices.usd = null
      this.card.prices.usd_foil = null

      expect(this.card.getPrice()).to.equal(this.originalPrices.eur)
    })

    it('returns the tix price if no usd or foil or eur price available', function () {
      this.card.prices.usd = null
      this.card.prices.usd_foil = null
      this.card.prices.eur = null

      expect(this.card.getPrice()).to.equal(this.originalPrices.tix)
    })

    it('returns an empty string if no pricing is available', function () {
      this.card.prices.usd = null
      this.card.prices.usd_foil = null
      this.card.prices.eur = null
      this.card.prices.tix = null

      expect(this.card.getPrice()).to.equal('')
    })

    it('returns an empty string if the specified type is not available', function () {
      this.card.prices.usd_foil = null

      expect(this.card.getPrice('usd_foil')).to.equal('')
    })
  })

  describe('getTokens', function () {
    beforeEach(function () {
      this.fakeRequestMethod.onCall(0).resolves(wrapScryfallResponse(this.fixtures.tokens.elephant, {
        requestMethod: this.fakeRequestMethod
      }))
      this.fakeRequestMethod.onCall(1).resolves(wrapScryfallResponse(this.fixtures.tokens.wolf, {
        requestMethod: this.fakeRequestMethod
      }))
      this.fakeRequestMethod.onCall(2).resolves(wrapScryfallResponse(this.fixtures.tokens.snake, {
        requestMethod: this.fakeRequestMethod
      }))
    })

    it('requests card objects for each token', function () {
      const card = wrapScryfallResponse(this.fixtures.cardWithMultipleTokens, {
        requestMethod: this.fakeRequestMethod
      })

      return card.getTokens().then((tokens) => {
        expect(this.fakeRequestMethod.callCount).to.equal(3)
        expect(this.fakeRequestMethod).to.be.calledWith('https://api.scryfall.com/cards/2dbccfc7-427b-41e6-b770-92d73994bf3b')
        expect(this.fakeRequestMethod).to.be.calledWith('https://api.scryfall.com/cards/2a452235-cebd-4e8f-b217-9b55fc1c3830')
        expect(this.fakeRequestMethod).to.be.calledWith('https://api.scryfall.com/cards/7bdb3368-fee3-4795-a23f-c97555ee7475')

        tokens.forEach((token) => {
          expect(token).to.be.an.instanceof(Card)
          expect(token.layout).to.equal('token')
        })
      })
    })

    it('resolves with an empty array when card has no `all_parts` attribute and no tokens in rules text', function () {
      const card = wrapScryfallResponse(this.fixtures.card, {
        requestMethod: this.fakeRequestMethod
      })

      return card.getTokens().then(tokens => {
        expect(tokens).to.deep.equal([])
      })
    })

    it('looks up tokens from prints for card when card has no `all_parts` attribute, but rules text mentions token', function () {
      const card = wrapScryfallResponse(this.fixtures.cardWithTokenButNoParts, {
        requestMethod: this.fakeRequestMethod
      })

      this.sandbox.stub(card, 'getPrints').resolves([
        wrapScryfallResponse(this.fixtures.cardWithTokenButNoParts, {
          requestMethod: this.fakeRequestMethod
        }),
        wrapScryfallResponse(this.fixtures.cardWithMultipleTokens, {
          requestMethod: this.fakeRequestMethod
        })
      ])

      return card.getTokens().then(tokens => {
        expect(card.getPrints.callCount).to.equal(1)

        expect(this.fakeRequestMethod.callCount).to.equal(3)
        expect(this.fakeRequestMethod).to.be.calledWith('https://api.scryfall.com/cards/2dbccfc7-427b-41e6-b770-92d73994bf3b')
        expect(this.fakeRequestMethod).to.be.calledWith('https://api.scryfall.com/cards/2a452235-cebd-4e8f-b217-9b55fc1c3830')
        expect(this.fakeRequestMethod).to.be.calledWith('https://api.scryfall.com/cards/7bdb3368-fee3-4795-a23f-c97555ee7475')

        tokens.forEach((token) => {
          expect(token).to.be.an.instanceof(Card)
          expect(token.layout).to.equal('token')
        })
      })
    })

    it('resolves with empty array when rules text mentions tokens but no prints have them', function () {
      const card = wrapScryfallResponse(this.fixtures.cardWithTokenButNoParts, {
        requestMethod: this.fakeRequestMethod
      })

      this.sandbox.stub(card, 'getPrints').resolves([
        wrapScryfallResponse(this.fixtures.cardWithTokenButNoParts, {
          requestMethod: this.fakeRequestMethod
        }),
        wrapScryfallResponse(this.fixtures.card, {
          requestMethod: this.fakeRequestMethod
        })
      ])

      return card.getTokens().then(tokens => {
        expect(card.getPrints.callCount).to.equal(1)

        expect(this.fakeRequestMethod.callCount).to.equal(0)
        expect(tokens).to.deep.equal([])
      })
    })
  })

  describe('getTaggerUrl', function () {
    it('returns the tagger url for the card', function () {
      const card = wrapScryfallResponse(this.fixtures.card, {
        requestMethod: this.fakeRequestMethod
      })

      const url = card.getTaggerUrl()

      expect(url).to.equal('https://tagger.scryfall.com/card/ima/77')
    })
  })
})
