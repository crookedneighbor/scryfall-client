'use strict'

function ScryfallError (scryfallResponse) {
  this.message = scryfallResponse.message || scryfallResponse.details
  this.stack = Error().stack

  Object.keys(scryfallResponse).forEach(function (key) {
    if (!this[key]) {
      this[key] = scryfallResponse[key]
    }
  }.bind(this))
}

ScryfallError.prototype = Object.create(Error.prototype)
ScryfallError.prototype.name = 'ScryfallError'
ScryfallError.prototype.constructor = ScryfallError

module.exports = ScryfallError
