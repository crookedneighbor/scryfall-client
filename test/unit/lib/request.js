'use strict'

const https = require('https')
const request = require('../../../lib/request')
const ScryfallError = require('../../../models/scryfall-error')
const GenericScryfallResponse = require('../../../models/generic-scryfall-response')

describe('request', function () {
  beforeEach(function () {
    this.fakeResponseOn = this.sandbox.stub()
    this.fakeResponseOn.withArgs('data').yieldsAsync('{"type": "foo"}')
    this.fakeResponseOn.withArgs('end').yieldsAsync()
    this.fakeResponse = {
      on: this.fakeResponseOn
    }
    this.fakeGet = {
      on: this.sandbox.stub()
    }
    this.sandbox.stub(https, 'get').returns(this.fakeGet).yields(this.fakeResponse)
  })

  describe('rawRequest', function () {
    it('returns a promise', function () {
      expect(request.rawRequest('foo')).to.be.an.instanceof(Promise)
    })

    it('makes a request to scryfall', function () {
      return request.rawRequest('foo').then(() => {
        expect(https.get).to.be.calledWith('https://api.scryfall.com/foo')
      })
    })

    it('resolves with a Scryfall Response', function () {
      return request.rawRequest('foo').then((response) => {
        expect(response).to.be.an.instanceof(GenericScryfallResponse)
      })
    })

    it('rejects when https.get errors', function () {
      let error = new Error('https error')

      https.get.restore()
      this.sandbox.stub(https, 'get').returns({
        on: this.sandbox.stub().withArgs('error').yieldsAsync(error)
      })

      return request.rawRequest('foo').then(this.expectToReject).catch((err) => {
        expect(err.originalError).to.equal(error)
        expect(err.message).to.equal('An unexpected error occurred when requesting resources from Scryfall.')
      })
    })

    it('rejects when JSON response is not parsable', function () {
      this.fakeResponseOn.withArgs('data').yields('{')

      return request.rawRequest('foo').then(this.expectToReject).catch((err) => {
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

      return request.rawRequest('foo').then(this.expectToReject).catch((err) => {
        expect(err).to.be.an.instanceof(ScryfallError)
        expect(err.message).to.equal('Failure')
        expect(err.httpStatus).to.equal(404)
      })
    })
  })
})
