'use strict'

var SCRYFALL_API_ENDPOINT = 'https://api.scryfall.com/'
var DEFAULT_SCRYFALL_DESIGNATED_WAIT_TIME = 100

var https = require('https')
var querystring = require('querystring')
var Promise = require('./promise')
var wrapScryfallResponse = require('./wrap-scryfall-response')
var convertSymbolsToEmoji = require('../lib/convert-symbols-to-emoji')
var ScryfallError = require('../models/scryfall-error')

function isFullScryfallUrl (url) {
  return url.indexOf(SCRYFALL_API_ENDPOINT) === 0
}

function endpointBeginsWithSlash (endpoint) {
  return endpoint.indexOf('/') === 0
}

function makeRequestFunction (options) {
  var requestInProgress = false
  var enquedRequests = []
  var requestFunction, wrapFunction

  options = options || {}

  function delayForScryfallDesignatedTime () {
    var waitTime = options.delayBetweenRequests || DEFAULT_SCRYFALL_DESIGNATED_WAIT_TIME

    return new Promise(function (resolve) {
      setTimeout(resolve, waitTime)
    })
  }

  function clearQueue () {
    enquedRequests = []
    requestInProgress = false
  }

  function checkForEnquedRequests (recursiveCheck) {
    var nextRequest

    if (enquedRequests.length > 0) {
      nextRequest = enquedRequests.splice(0, 1)[0]
      delayForScryfallDesignatedTime().then(function () {
        nextRequest.start()
      })
    } else if (recursiveCheck) {
      requestInProgress = false
    } else {
      delayForScryfallDesignatedTime().then(function () {
        checkForEnquedRequests(true)
      })
    }
  }

  function prepareRequest (request, queryUrl) {
    var pendingResolveFunction, pendingRejectFunction

    return {
      pending: function () {
        return new Promise(function (resolve, reject) {
          pendingResolveFunction = resolve
          pendingRejectFunction = reject
        })
      },
      start: function () {
        https.get(queryUrl, function (response) {
          var body = ''

          response.on('data', function (chunk) {
            body += chunk
          })

          response.on('end', function () {
            try {
              body = JSON.parse(body)

              if (body.object === 'error') {
                pendingRejectFunction(new ScryfallError(body))
              } else {
                pendingResolveFunction(wrapFunction(body))
              }
            } catch (err) {
              pendingRejectFunction(new ScryfallError({
                message: 'Could not parse response from Scryfall.',
                thrownError: err
              }))
            }

            checkForEnquedRequests()
          })
        }).on('error', function (err) {
          pendingRejectFunction(new ScryfallError({
            message: 'An unexpected error occurred when requesting resources from Scryfall.',
            originalError: err
          }))
          checkForEnquedRequests()
        })
      }
    }
  }

  requestFunction = function request (endpoint, query) {
    var queryUrl, queryParams, pendingRequest, pendingRequestHandler

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

    pendingRequestHandler = prepareRequest(request, queryUrl)
    pendingRequest = pendingRequestHandler.pending()

    if (!requestInProgress) {
      requestInProgress = true
      pendingRequestHandler.start()
    } else {
      enquedRequests.push(pendingRequestHandler)
    }

    return pendingRequest
  }

  wrapFunction = function (body) {
    var wrapOptions = {
      requestMethod: requestFunction
    }

    if (options.textTransformer) {
      wrapOptions.textTransformer = options.textTransformer
    } else if (options.convertSymbolsToSlackEmoji) {
      wrapOptions.textTransformer = convertSymbolsToEmoji.slack
    } else if (options.convertSymbolsToDiscordEmoji) {
      wrapOptions.textTransformer = convertSymbolsToEmoji.discord
    }
    return wrapScryfallResponse(body, wrapOptions)
  }

  requestFunction.wrapFunction = wrapFunction
  requestFunction.clearQueue = clearQueue

  return requestFunction
}

module.exports = makeRequestFunction
