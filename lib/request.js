'use strict'

var SCRYFALL_API_ENDPOINT = 'https://api.scryfall.com/'
var https = require('https')
var querystring = require('querystring')
var Promise = require('./promise')
var wrapScryfallResponse = require('./wrap-scryfall-response')
var ScryfallError = require('../models/scryfall-error')

function isFullScryfallUrl (url) {
  return url.indexOf(SCRYFALL_API_ENDPOINT) === 0
}

function endpointBeginsWithSlash (endpoint) {
  return endpoint.indexOf('/') === 0
}

function rawRequest (endpoint, query) {
  var queryUrl, queryParams

  if (isFullScryfallUrl(endpoint)) {
    queryUrl = endpoint
  } else {
    if (endpointBeginsWithSlash(endpoint)) {
      endpoint = endpoint.substring(1)
    }
    queryUrl = SCRYFALL_API_ENDPOINT + endpoint
  }

  if (query) {
    queryParams = querystring.stringify(query)

    if (queryUrl.indexOf('?') > -1) {
      queryUrl += '&'
    } else {
      queryUrl += '?'
    }

    queryUrl += queryParams
  }

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
            resolve(wrapScryfallResponse(body, {
              requestMethod: rawRequest
            }))
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
