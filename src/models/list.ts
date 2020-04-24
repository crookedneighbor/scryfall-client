"use strict";

var ArrayLike = require("./array-like");

function List(scryfallObject, config) {
  var arr = ArrayLike.call(this, scryfallObject);

  arr.__proto__ = List.prototype; // eslint-disable-line no-proto
  arr._request = config.requestMethod;
  arr.next = function () {
    if (!this.has_more) {
      return Promise.reject(new Error("No additional pages."));
    }

    return this._request(this.next_page);
  }.bind(arr);

  return arr;
}

List.prototype = Object.create(ArrayLike.prototype);
List.prototype.constructor = List;

module.exports = List;