'use strict'

const sinon = require('sinon')
const chai = require('chai')
const fixtures = require('./fixtures')

chai.use(require('sinon-chai'))

global.expect = chai.expect

beforeEach(function () {
  this.sandbox = sinon.sandbox.create()
  this.expectToReject = () => {
    throw new Error('expect promise to reject')
  }
  this.fixtures = fixtures
})

afterEach(function () {
  this.sandbox.restore()
})
