'use strict'

var SCRYFALL_API_ENDPOINT = 'https://api.scryfall.com/'
var https = require('https')
var Promise = global.Promise || require('promise-polyfill')
var wrapScryfallResponse = require('./wrap-scryfall-response')
var ScryfallError = require('../models/scryfall-error')

function rawRequest (endpoint) {
  var queryUrl = SCRYFALL_API_ENDPOINT + endpoint

  return new Promise(function (resolve, reject) {
    https.get(queryUrl, function (response) {
      var body = ''

      response.on('data', function (chunk) {
        body += chunk
      })

      response.on('end', function () {
        try {
          body = JSON.parse(body)

          if (body.object === 'error') {
            reject(new ScryfallError(body))
          } else {
            resolve(wrapScryfallResponse(body))
          }
        } catch (err) {
          reject(new ScryfallError({
            message: 'Could not parse response from Scryfall.'
          }))
        }
      })
    }).on('error', function (err) {
      reject(new ScryfallError({
        message: 'An unexpected error occurred when requesting resources from Scryfall.',
        originalError: err
      }))
    })
  })
}

module.exports = {
  rawRequest: rawRequest
}
