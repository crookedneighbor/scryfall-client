'use strict'

var Promise = require('../lib/promise')
var ArrayLike = require('./array-like')

function List (scryfallObject, requestMethod) {
  var arr = ArrayLike.call(this, scryfallObject)

  arr.__proto__ = List.prototype // eslint-disable-line no-proto
  arr._request = requestMethod

  return arr
}

List.prototype = Object.create(ArrayLike.prototype)
List.prototype.constructor = List

List.prototype.next = function () {
  if (!this.has_more) {
    return Promise.reject(new Error('No additional pages.'))
  }

  return this._request(this.next_page)
}

module.exports = List
