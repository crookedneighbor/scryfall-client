'use strict'

const request = require('../../../lib/request')
const List = require('../../../models/list')

describe('List', function () {
  beforeEach(function () {
    this.sandbox.stub(request, 'rawRequest').resolves({})
  })

  it('inherits from Array', function () {
    let list = new List(this.fixtures.listOfCards)

    expect(list).to.be.an.instanceof(Array)
    expect(list).to.be.an.instanceof(List)
  })

  it('its entries are defined by data properties', function () {
    let list = new List(this.fixtures.listOfCards)

    expect(list[0].name).to.be.a('string')
    expect(list[0].name).to.equal(this.fixtures.listOfCards.data[0].name)
    expect(list[1].name).to.be.a('string')
    expect(list[1].name).to.equal(this.fixtures.listOfCards.data[1].name)
  })

  it('responds to Array methods', function () {
    let list = new List(this.fixtures.listOfCards)

    expect(list.length).to.equal(2)

    list.push({foo: 'bar'})
    expect(list.length).to.equal(3)

    list.pop()
    expect(list.length).to.equal(2)

    let names = list.map(entry => entry.name)

    expect(names).to.be.an.instanceof(Array)
    expect(names).to.not.be.an.instanceof(List)
    expect(names[0]).to.equal(this.fixtures.listOfCards.data[0].name)
    expect(names[1]).to.equal(this.fixtures.listOfCards.data[1].name)
  })

  it('applies properties to object', function () {
    let list = new List(this.fixtures.listOfCards)

    expect(list.total_cards).to.be.a('number')
    expect(list.total_cards).to.equal(this.fixtures.listOfCards.total_cards)
    expect(list.has_more).to.be.a('boolean')
    expect(list.has_more).to.equal(this.fixtures.listOfCards.has_more)
  })

  it('does not apply data property to object', function () {
    let list = new List(this.fixtures.listOfCards)

    expect(list.data).to.equal(undefined)
  })
})
