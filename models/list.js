'use strict'

var request = require('../lib/request')

function List (scryfallObject) {
  var arr = []
  var entries = scryfallObject.data

  arr.push.apply(arr, scryfallObject.data)
  arr.__proto__ = List.prototype

  Object.keys(scryfallObject).forEach(function (key) {
    if (key === 'data' || arr[key]) {
      return
    }

    arr[key] = scryfallObject[key]
  })

  return arr
}

List.prototype = new Array

module.exports = List
