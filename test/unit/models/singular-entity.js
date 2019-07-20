'use strict'

const SingularEntity = require('../../../models/singular-entity')

describe('SingularEntity', function () {
  beforeEach(function () {
    this.fakeRequestMethod = this.sandbox.stub()
    this.fakeScryfallObject = {
      object: 'foo'
    }

    function ChildModel (scryfallObject, requestMethod) {
      SingularEntity.call(this, scryfallObject, requestMethod)
    }
    ChildModel.SCRYFALL_MODEL_NAME = 'foo'
    ChildModel.prototype = Object.create(SingularEntity.prototype)
    ChildModel.prototype.constructor = ChildModel

    this.ChildModel = ChildModel
  })

  it('does not throw if object type matches child class\'s type', function () {
    expect(() => {
      new this.ChildModel(this.fakeScryfallObject, this.fakeRequestMethod) // eslint-disable-line no-new
    }).to.not.throw()
  })

  it('throws if object type does not match child class\'s type', function () {
    expect(() => {
      new this.ChildModel(this.fixtures.listOfRulings, this.fakeRequestMethod) // eslint-disable-line no-new
    }).to.throw('Object type must be "foo"')
  })
})
