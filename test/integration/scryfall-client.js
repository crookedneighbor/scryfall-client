'use strict'

const ScryfallClient = require('../../')
const fakeCard = require('../fixtures/card')
const Card = require('../../models/card')

describe('scryfallClient', function () {
  this.slow(5000)
  this.timeout(9000)

  beforeEach(function () {
    this.client = new ScryfallClient()
  })

  describe('get', function () {
    it('makes a request to scryfall', function () {
      return this.client.get('cards/random').then((card) => {
        expect(card.object).to.equal('card')
      })
    })

    it('handles errors', function () {
      return this.client.get('foo').then(this.expectToReject).catch((error) => {
        expect(error.message).to.be.a('string')
        expect(error.status).to.equal(404)
      })
    })

    it('can send query params', function () {
      return this.client.get('cards/search', {
        q: 'Budoka Gardener c:g'
      }).then((list) => {
        expect(list[0].object).to.equal('card')
      })
    })

    context('List object', function () {
      it('can get the next page of results', function () {
        return this.client.get('cards/search', {
          q: 'set:rix'
        }).then((list) => {
          expect(list.object).to.equal('list')

          return list.next()
        }).then((list) => {
          expect(list.object).to.equal('list')
        })
      })

      it('can recursively call next', function () {
        let totalCards

        function collectCards (list, allCards) {
          allCards = allCards || []
          allCards.push.apply(allCards, list)

          if (!list.has_more) {
            return allCards
          }

          return list.next().then(function (newList) {
            return collectCards(newList, allCards)
          })
        }

        return this.client.get('cards/search', {
          q: 'format:standard r:r'
        }).then(function (list) {
          totalCards = list.total_cards

          return collectCards(list)
        }).then(function (allRareCardsInStandard) {
          expect(allRareCardsInStandard.length).to.equal(totalCards)
        })
      })
    })

    context('Set object', function () {
      it('can get cards from set', function () {
        return this.client.get('sets/dom').then((set) => {
          expect(set.object).to.equal('set')

          return set.getCards()
        }).then((list) => {
          expect(list.object).to.equal('list')
          expect(list[0].object).to.equal('card')
        })
      })
    })

    context('Card object', function () {
      beforeEach(function () {
        this.budokaGardener = '49999b95-5e62-414c-b975-4191b9c1ab39'
        this.windfall = '357cf802-2d66-49a4-bf43-ab3bc30ab825'
        this.docentOfPerfection = '30c3d4c1-dc3d-4529-9d6e-8c16149cf6da'
        this.brunaFadingLight = '27907985-b5f6-4098-ab43-15a0c2bf94d5'
        this.giselaBrokenBlade = 'c75c035a-7da9-4b36-982d-fca8220b1797'
        this.brisela = '5a7a212e-e0b6-4f12-a95c-173cae023f93'
        this.beastialMenace = '73c16134-692d-4fd1-bffa-f9342113cbd8'
      })

      it('can get rulings for card', function () {
        return this.client.get(`cards/${this.budokaGardener}`).then((card) => {
          return card.getRulings()
        }).then((rulings) => {
          expect(rulings.object).to.equal('list')
          expect(rulings[0].object).to.equal('ruling')
        })
      })

      it('can get set object for card', function () {
        return this.client.get(`cards/${this.budokaGardener}`).then((card) => {
          return card.getSet()
        }).then((set) => {
          expect(set.object).to.equal('set')
        })
      })

      it('can get prints for card', function () {
        return this.client.get(`cards/${this.windfall}`).then((card) => {
          return card.getPrints()
        }).then((prints) => {
          expect(prints.object).to.equal('list')
          expect(prints.length).to.be.greaterThan(1)
        })
      })

      it('can check legality of a card', function () {
        return this.client.get('cards/search', {
          q: 'format:standard r:r'
        }).then((list) => {
          const card = list[0]

          expect(card.isLegal('standard')).to.equal(true)
          expect(card.isLegal('pauper')).to.equal(false)
        })
      })

      context('card images', function () {
        it('can get the image of a card', function () {
          let id

          return this.client.get(`cards/${this.windfall}`).then((card) => {
            id = card.id

            const image = card.getImage()
            expect(image).to.be.a('string')
            expect(image).to.include('img.scryfall.com')
            expect(image).to.include(id)
          })
        })

        it('can get the image of a transform card', function () {
          let id

          return this.client.get(`cards/${this.docentOfPerfection}`).then((card) => {
            id = card.id

            const image = card.getImage()
            expect(image).to.be.a('string')
            expect(image).to.include('img.scryfall.com')
            expect(image).to.include(id)
          })
        })

        it('can get the image of a meld card', function () {
          let id

          return this.client.get(`cards/${this.brunaFadingLight}`).then((card) => {
            id = card.id

            const image = card.getImage()
            expect(image).to.be.a('string')
            expect(image).to.include('img.scryfall.com')
            expect(image).to.include(id)
          })
        })

        it('can get the image of a melded card', function () {
          let id

          return this.client.get(`cards/${this.brisela}`).then((card) => {
            id = card.id

            const image = card.getImage()
            expect(image).to.be.a('string')
            expect(image).to.include('img.scryfall.com')
            expect(image).to.include(id)
          })
        })

        it('can get the backside image of a normal card (missing url)', function () {
          return this.client.get(`cards/${this.windfall}`).then((card) => {
            const image = card.getBackImage()
            expect(image).to.equal('https://img.scryfall.com/errors/missing.jpg')
          })
        })

        it('can get the backside image of a meld card (missing url)', function () {
          return this.client.get(`cards/${this.brunaFadingLight}`).then((card) => {
            const image = card.getBackImage()
            expect(image).to.equal('https://img.scryfall.com/errors/missing.jpg')
          })
        })

        it('can get the backside image of a transform card', function () {
          let id

          return this.client.get(`cards/${this.docentOfPerfection}`).then((card) => {
            id = card.id

            const image = card.getBackImage()
            expect(image).to.include('img.scryfall.com')
            expect(image).to.include(id)
          })
        })
      })

      it('can get price for a card', function () {
        return this.client.get(`cards/${this.beastialMenace}`).then((card) => {
          const price = Number(card.getPrice())

          expect(price).to.be.greaterThan(0)
        })
      })

      it('can get tokens for a card', function () {
        return this.client.get(`cards/${this.beastialMenace}`).then((card) => {
          return card.getTokens()
        }).then((tokens) => {
          expect(tokens.length).to.equal(3)

          tokens.forEach((token) => {
            expect(token.layout).to.equal('token')
          })
        })
      })
    })
  })

  describe('wrap', function () {
    it('can wrap saved response object into scryfall response', function () {
      const card = this.client.wrap(fakeCard)

      expect(card).to.be.an.instanceof(Card)
    })
  })
})
