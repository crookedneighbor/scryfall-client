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

  it('passes on all properties', function () {
    let error = new ScryfallError({
      object: 'error',
      code: 'not_found',
      type: 'ambiguous',
      status: 404,
      details: 'Too many cards match ambiguous name “jace”. Add more words to refine your search.'
    })

    expect(error.code).to.equal('not_found')
    expect(error.status).to.equal(404)
    expect(error.details).to.equal('Too many cards match ambiguous name “jace”. Add more words to refine your search.')
    expect(error.type).to.equal('ambiguous')
  })
})
