'use strict'

function ScryfallError (scryfallResponse) {
  this.message = scryfallResponse.message || scryfallResponse.details
  this.stack = Error().stack

  if (scryfallResponse.originalError) {
    this.originalError = scryfallResponse.originalError
  }
  if (scryfallResponse.status) {
    this.httpStatus = scryfallResponse.status
  }
}

ScryfallError.prototype = Object.create(Error.prototype)
ScryfallError.prototype.name = 'ScryfallError'
ScryfallError.prototype.constructor = ScryfallError

module.exports = ScryfallError
