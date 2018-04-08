'use strict'

var request = require('../lib/request')
var Promise = require('../lib/promise')
var ArrayLike = require('./array-like')

function List (scryfallObject) {
  var arr = ArrayLike.call(this, scryfallObject)

  arr.__proto__ = List.prototype // eslint-disable-line no-proto

  return arr
}

List.prototype = Object.create(ArrayLike.prototype)
List.prototype.constructor = List

List.prototype.next = function () {
  if (!this.has_more) {
    return Promise.reject(new Error('No additional pages.'))
  }

  return request.rawRequest(this.next_page)
}

module.exports = List
