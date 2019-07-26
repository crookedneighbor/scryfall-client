'use strict'

const wrapScryfallResponse = require('../../../lib/wrap-scryfall-response')
const List = require('../../../models/list')

describe('List', function () {
  beforeEach(function () {
    this.fakeRequestMethod = this.sandbox.stub()
    this.config = {
      requestMethod: this.fakeRequestMethod
    }
  })

  it('inherits from Array', function () {
    const list = new List(this.fixtures.listOfCards, this.config)

    expect(list).to.be.an.instanceof(Array)
    expect(list).to.be.an.instanceof(List)
  })

  it('its entries are defined by data properties', function () {
    const list = new List(this.fixtures.listOfCards, this.config)

    expect(list[0].name).to.be.a('string')
    expect(list[0].name).to.equal(this.fixtures.listOfCards.data[0].name)
    expect(list[1].name).to.be.a('string')
    expect(list[1].name).to.equal(this.fixtures.listOfCards.data[1].name)
  })

  it('responds to Array methods', function () {
    const list = new List(this.fixtures.listOfCards, this.config)

    expect(list.length).to.equal(2)

    list.push({ foo: 'bar' })
    expect(list.length).to.equal(3)

    list.pop()
    expect(list.length).to.equal(2)

    const names = list.map(entry => entry.name)

    expect(names).to.be.an.instanceof(Array)
    expect(names).to.not.be.an.instanceof(List)
    expect(names[0]).to.equal(this.fixtures.listOfCards.data[0].name)
    expect(names[1]).to.equal(this.fixtures.listOfCards.data[1].name)
  })

  it('applies properties to object', function () {
    const list = new List(this.fixtures.listOfCards, this.config)

    expect(list.total_cards).to.be.a('number')
    expect(list.total_cards).to.equal(this.fixtures.listOfCards.total_cards)
    expect(list.has_more).to.be.a('boolean')
    expect(list.has_more).to.equal(this.fixtures.listOfCards.has_more)
  })

  it('does not apply data property to object', function () {
    const list = new List(this.fixtures.listOfCards, this.config)

    expect(list.data).to.equal(undefined)
  })

  describe('next', function () {
    beforeEach(function () {
      this.fakeRequestMethod.resolves(wrapScryfallResponse(this.fixtures.listOfCardsPage2, {
        requestMethod: this.fakeRequestMethod
      }))
    })

    it('makes a request for the next page', function () {
      const list = new List(this.fixtures.listOfCards, this.config)

      return list.next().then((list2) => {
        expect(this.fakeRequestMethod).to.have.been.calledWith(this.fixtures.listOfCards.next_page)
        expect(list2[0].name).to.equal(this.fixtures.listOfCardsPage2.data[0].name)
      })
    })

    it('rejects promise if there are no additional results', function () {
      const list = new List(this.fixtures.listOfCards, this.config)

      list.has_more = false

      return list.next().then(this.expectToReject).catch((err) => {
        expect(err.message).to.equal('No additional pages.')
      })
    })
  })
})
