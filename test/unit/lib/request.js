'use strict'

const https = require('https')
const makeRequestFunction = require('../../../lib/request')
const ScryfallError = require('../../../models/scryfall-error')
const GenericScryfallResponse = require('../../../models/generic-scryfall-response')

describe('makeRequestFunction', function () {
  beforeEach(function () {
    this.fakeResponseOn = this.sandbox.stub()
    this.fakeResponseOn.withArgs('data').yieldsAsync('{"object": "foo"}')
    this.fakeResponseOn.withArgs('end').yieldsAsync()
    this.fakeResponse = {
      on: this.fakeResponseOn
    }
    this.fakeGet = {
      on: this.sandbox.stub()
    }
    this.sandbox.stub(https, 'get').returns(this.fakeGet).yields(this.fakeResponse)
    this.request = makeRequestFunction()
  })

  afterEach(function () {
    this.request.clearQueue()
  })

  it('returns a request function', function () {
    let request = makeRequestFunction()

    expect(request).to.be.an.instanceof(Function)
  })

  it('automatically rate limits according to Scryfall\'s recomendation for request frequency of no requests within 100 ms', function () {
    let request = makeRequestFunction()
    let count = 0
    let intervalRef = setInterval(function () {
      count++
    }, 1)

    return request('foo').then(() => {
      return request('bar')
    }).then(() => {
      return request('baz')
    }).then(() => {
      clearInterval(intervalRef)

      expect(count).to.be.greaterThan(280)
      expect(count).to.be.lessThan(400)
    })
  })

  it('can configure rate limit', function () {
    let request = makeRequestFunction({
      delayBetweenRequests: 200
    })
    let count = 0
    let intervalRef = setInterval(function () {
      count++
    }, 1)

    return request('foo').then(() => {
      return request('bar')
    }).then(() => {
      return request('baz')
    }).then(() => {
      clearInterval(intervalRef)

      expect(count).to.be.greaterThan(580)
      expect(count).to.be.lessThan(800)
    })
  })

  it('rate limits among multiple requests happening at once', function () {
    let request = makeRequestFunction()
    let count = 0
    let intervalRef = setInterval(function () {
      count++
    }, 1)

    return Promise.all([
      request('foo'),
      request('bar'),
      request('baz'),
      request('biz'),
      request('buz')
    ]).then(() => {
      clearInterval(intervalRef)

      expect(count).to.be.greaterThan(280)
      expect(count).to.be.lessThan(400)
    })
  })

  it('does not rate limite a request that occurs after rate limiting from initial request is done', function () {
    let request = makeRequestFunction()
    let count = 0
    let intervalRef
    let wait = function (time) {
      return new Promise((resolve) => {
        setTimeout(resolve, time)
      })
    }

    return request('foo').then(() => {
      return wait(100)
    }).then(() => {
      intervalRef = setInterval(function () {
        count++
      }, 1)

      return request('bar')
    }).then(() => {
      clearInterval(intervalRef)

      expect(count).to.be.lessThan(10)
    })
  })

  it('can pass in textTransformer option', function () {
    let request = makeRequestFunction({
      textTransformer: function (text) {
        return text.replace(/{(.)(\/(.))?}/g, '<img src="https://example.com/mana-$1$3.png" />')
      }
    })

    this.fakeResponseOn.withArgs('data').yields(JSON.stringify(this.fixtures.card))

    return request('foo').then((card) => {
      expect(card.mana_cost).to.equal('<img src="https://example.com/mana-2.png" /><img src="https://example.com/mana-U.png" />')
    })
  })

  it('surfaces error about textTransformer when function throws an error', function () {
    let request = makeRequestFunction({
      textTransformer: function () {
        throw new Error('bad function')
      }
    })

    this.fakeResponseOn.withArgs('data').yields(JSON.stringify(this.fixtures.card))

    return request('foo').then(this.expectToReject).catch(function (err) {
      expect(err.thrownError.message).to.equal('bad function')
    })
  })

  it('can pass in convertSymbolsToSlackEmoji option', function () {
    let request = makeRequestFunction({
      convertSymbolsToSlackEmoji: true
    })

    this.fakeResponseOn.withArgs('data').yields(JSON.stringify(this.fixtures.card))

    return request('foo').then((card) => {
      expect(card.mana_cost).to.equal(':mana-2::mana-U:')
    })
  })

  it('can pass in convertSymbolsToDiscordEmoji option', function () {
    let request = makeRequestFunction({
      convertSymbolsToDiscordEmoji: true
    })

    this.fakeResponseOn.withArgs('data').yields(JSON.stringify(this.fixtures.card))

    return request('foo').then((card) => {
      expect(card.mana_cost).to.equal(':mana2::manaU:')
    })
  })

  it('prefers textTransformer option over slack emoji option', function () {
    let request = makeRequestFunction({
      convertSymbolsToSlackEmoji: true,
      textTransformer: function (text) {
        return text.replace(/{(.)(\/(.))?}/g, '<img src="https://example.com/mana-$1$3.png" />')
      }
    })

    this.fakeResponseOn.withArgs('data').yields(JSON.stringify(this.fixtures.card))

    return request('foo').then((card) => {
      expect(card.mana_cost).to.equal('<img src="https://example.com/mana-2.png" /><img src="https://example.com/mana-U.png" />')
    })
  })

  it('prefers convertSymbolsToSlackEmoji over convertSymbolsToSlackEmoji option', function () {
    let request = makeRequestFunction({
      convertSymbolsToDiscordEmoji: true,
      convertSymbolsToSlackEmoji: true
    })

    this.fakeResponseOn.withArgs('data').yields(JSON.stringify(this.fixtures.card))

    return request('foo').then((card) => {
      expect(card.mana_cost).to.equal(':mana-2::mana-U:')
    })
  })

  it('returns a promise', function () {
    expect(this.request('foo')).to.be.an.instanceof(Promise)
  })

  it('makes a request to scryfall', function () {
    return this.request('foo').then(() => {
      expect(https.get).to.be.calledWith('https://api.scryfall.com/foo')
    })
  })

  it('strips out leading /', function () {
    return this.request('/foo').then(() => {
      expect(https.get).to.be.calledWith('https://api.scryfall.com/foo')
    })
  })

  it('allows passing in the full domain', function () {
    return this.request('https://api.scryfall.com/foo').then(() => {
      expect(https.get).to.be.calledWith('https://api.scryfall.com/foo')
    })
  })

  it('resolves with a Scryfall Response', function () {
    return this.request('foo').then((response) => {
      expect(response).to.be.an.instanceof(GenericScryfallResponse)
    })
  })

  it('can pass object as query params', function () {
    return this.request('foo', { q: 'my-query' }).then((response) => {
      expect(https.get).to.be.calledWith('https://api.scryfall.com/foo?q=my-query')
    })
  })

  it('can pass object as multiple query params', function () {
    return this.request('foo', { q: 'my-query', bar: 'baz' }).then((response) => {
      expect(https.get).to.be.calledWith('https://api.scryfall.com/foo?q=my-query&bar=baz')
    })
  })

  it('can pass object as query params when url already has query params', function () {
    return this.request('foo?firstQuery=bar', { q: 'my-query' }).then((response) => {
      expect(https.get).to.be.calledWith('https://api.scryfall.com/foo?firstQuery=bar&q=my-query')
    })
  })

  it('uri encodes the query string params', function () {
    return this.request('foo', { q: 'o:vigilance t:equipment o:"draw cards"' }).then((response) => {
      expect(https.get).to.be.calledWith('https://api.scryfall.com/foo?q=o%3Avigilance%20t%3Aequipment%20o%3A%22draw%20cards%22')
    })
  })

  it('rejects when https.get errors', function () {
    let error = new Error('https error')

    https.get.restore()
    this.sandbox.stub(https, 'get').returns({
      on: this.sandbox.stub().withArgs('error').yieldsAsync(error)
    })

    return this.request('foo').then(this.expectToReject).catch((err) => {
      expect(err.originalError).to.equal(error)
      expect(err.message).to.equal('An unexpected error occurred when requesting resources from Scryfall.')
    })
  })

  it('rejects when JSON response is not parsable', function () {
    this.fakeResponseOn.withArgs('data').yields('{')

    return this.request('foo').then(this.expectToReject).catch((err) => {
      expect(err).to.be.an.instanceof(ScryfallError)
      expect(err.message).to.equal('Could not parse response from Scryfall.')
    })
  })

  it('rejects when body is an error object', function () {
    this.fakeResponseOn.withArgs('data').yields(JSON.stringify({
      object: 'error',
      code: 'not_found',
      status: 404,
      details: 'Failure'
    }))

    return this.request('foo').then(this.expectToReject).catch((err) => {
      expect(err).to.be.an.instanceof(ScryfallError)
      expect(err.message).to.equal('Failure')
      expect(err.status).to.equal(404)
    })
  })
})
