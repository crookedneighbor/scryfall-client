'use strict'

const ScryfallError = require('../../../models/scryfall-error')

describe('ScryfallError', function () {
  it('inherits from Error', function () {
    let error = new ScryfallError({})

    expect(error).to.be.an.instanceof(Error)
  })

  it('uses message from object', function () {
    let error = new ScryfallError({
      message: 'custom message'
    })

    expect(error.message).to.equal('custom message')
  })

  it('uses details for message from object if no message exists', function () {
    let error = new ScryfallError({
      object: 'error',
      code: 'not_found',
      status: 404,
      details: 'Message'
    })

    expect(error.message).to.equal('Message')
  })

  it('prefers message over details', function () {
    let error = new ScryfallError({
      object: 'error',
      code: 'not_found',
      status: 404,
      message: 'message',
      details: 'details'
    })

    expect(error.message).to.equal('message')
  })

  it('passes on status as httpStatus', function () {
    let error = new ScryfallError({
      object: 'error',
      code: 'not_found',
      status: 404,
      details: 'Message'
    })

    expect(error.httpStatus).to.equal(404)
  })

  it('passes on original error', function () {
    let originalError = new Error('foo')
    let error = new ScryfallError({
      message: 'custom message',
      originalError: originalError
    })

    expect(error.originalError).to.equal(originalError)
  })
})
