'use strict'

const ScryfallClient = require('../../')

describe('scryfallClient', function () {
  this.slow(5000)
  this.timeout(9000)

  beforeEach(function () {
    this.client = new ScryfallClient()
  })

  describe('rawRequest', function () {
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
  })

  describe('List object', function () {
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

  describe('Set object', function () {
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

  describe('Card object', function () {
    beforeEach(function () {
      this.budokaGardener = '49999b95-5e62-414c-b975-4191b9c1ab39'
      this.windfall = '357cf802-2d66-49a4-bf43-ab3bc30ab825'
      this.docentOfPerfection = '30c3d4c1-dc3d-4529-9d6e-8c16149cf6da'
      this.brunaFadingLight = '27907985-b5f6-4098-ab43-15a0c2bf94d5'
      this.brisela = '5a7a212e-e0b6-4f12-a95c-173cae023f93'
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
        let card = list[0]

        expect(card.isLegal('standard')).to.equal(true)
        expect(card.isLegal('pauper')).to.equal(false)
      })
    })

    it('can get the image of a card', function () {
      let collector

      return this.client.get(`cards/${this.windfall}`).then((card) => {
        collector = card.collector_number

        return card.getImage()
      }).then((image) => {
        expect(image).to.be.a('string')
        expect(image).to.include(`${collector}.jpg`)
      })
    })

    it('can get the image of a transform card', function () {
      let collector

      return this.client.get(`cards/${this.docentOfPerfection}`).then((card) => {
        collector = card.collector_number

        return card.getImage()
      }).then((image) => {
        expect(image).to.be.a('string')
        expect(image).to.include(`${collector}a.jpg`)
      })
    })

    it('can get the image of a meld card', function () {
      let collector

      return this.client.get(`cards/${this.brunaFadingLight}`).then((card) => {
        collector = card.collector_number

        return card.getImage()
      }).then((image) => {
        expect(image).to.be.a('string')
        expect(image).to.include(`${collector}.jpg`)
      })
    })

    it('can get the image of a melded card', function () {
      let collector

      return this.client.get(`cards/${this.brisela}`).then((card) => {
        collector = card.collector_number

        return card.getImage()
      }).then((image) => {
        expect(image).to.be.a('string')
        expect(image).to.include(`${collector}.jpg`)
      })
    })

    it('can get the backside image of a normal card', function () {
      return this.client.get(`cards/${this.windfall}`).then((card) => {
        return card.getBackImage()
      }).then((images) => {
        expect(images).to.be.an('array')
        expect(images.length).to.equal(1)
        expect(images[0]).to.be.a('string')
        expect(images[0]).to.equal('https://img.scryfall.com/errors/missing.jpg')
      })
    })

    it('can get the backside image of a transform card', function () {
      let collector

      return this.client.get(`cards/${this.docentOfPerfection}`).then((card) => {
        collector = card.collector_number

        return card.getBackImage()
      }).then((images) => {
        expect(images).to.be.an('array')
        expect(images.length).to.equal(1)
        expect(images[0]).to.be.a('string')
        expect(images[0]).to.include(`${collector}b.jpg`)
      })
    })

    it('can get the backside image of a meld card', function () {
      let collector

      return this.client.get(`cards/${this.brunaFadingLight}`).then((card) => {
        collector = card.collector_number.split('a')[0]

        return card.getBackImage()
      }).then((images) => {
        expect(images).to.be.an('array')
        expect(images.length).to.equal(1)
        expect(images[0]).to.be.a('string')
        expect(images[0]).to.include(`${collector}b.jpg`)
      })
    })

    it('can get the backside image of a melded card', function () {
      let collector

      return this.client.get(`cards/${this.brisela}`).then((card) => {
        collector = card.collector_number.split('b')[0]

        return card.getBackImage()
      }).then((images) => {
        expect(images).to.be.an('array')
        expect(images.length).to.equal(2)
        expect(images[0]).to.be.a('string')
        expect(images[0]).to.include(`${collector}a.jpg`)
        expect(images[1]).to.be.a('string')
        expect(images[1]).to.not.equal(images[0])
        expect(images[1]).to.include(`a.jpg`)
      })
    })
  })
})
