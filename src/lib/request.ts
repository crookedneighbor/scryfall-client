"use strict";

const SCRYFALL_API_ENDPOINT = "https://api.scryfall.com/";
const DEFAULT_SCRYFALL_DESIGNATED_WAIT_TIME = 100;

import superagent = require("superagent");
import querystring = require("querystring");
import wrapScryfallResponse from "Lib/wrap-scryfall-response";
import convertSymbolsToEmoji from "Lib/convert-symbols-to-emoji";
import ScryfallError from "Models/scryfall-error";

import type { ScryfallResponse } from "Types/api/response";
import type { ModelConfig } from "Types/model-config";

interface PendingRequest {
  pending: Function;
  start: Function;
}

interface RequestOptions extends Partial<ModelConfig> {
  method?: "post" | "get";
  body?: Record<string, any>;
  delayBetweenRequests?: number;
  query?: Record<string, string>;
  convertSymbolsToSlackEmoji?: boolean;
  convertSymbolsToDiscordEmoji?: boolean;
}

function sendRequest(url: string, options: RequestOptions) {
  let superagentPromise;

  options = options || {};

  if (options.method === "post") {
    superagentPromise = superagent.post(url);
  } else {
    superagentPromise = superagent.get(url);
  }

  return superagentPromise
    .send(options.body)
    .set("Accept", "application/json")
    .then((response) => {
      let body;

      try {
        body = JSON.parse(response.text);
      } catch (parsingError) {
        return Promise.reject(
          new ScryfallError({
            message: "Could not parse response from Scryfall.",
            thrownError: parsingError,
          })
        );
      }

      if (body.object === "error") {
        return Promise.reject(new ScryfallError(body));
      }

      return body;
    });
}

function isFullScryfallUrl(url: string) {
  return url.indexOf(SCRYFALL_API_ENDPOINT) === 0;
}

function endpointBeginsWithSlash(endpoint: string) {
  return endpoint.indexOf("/") === 0;
}

function makeRequestFunction(options: RequestOptions = {}) {
  let requestInProgress = false;
  let enquedRequests: PendingRequest[] = [];

  function delayForScryfallDesignatedTime() {
    const waitTime =
      options.delayBetweenRequests || DEFAULT_SCRYFALL_DESIGNATED_WAIT_TIME;

    return new Promise(function (resolve) {
      setTimeout(resolve, waitTime);
    });
  }

  function clearQueue() {
    enquedRequests = [];
    requestInProgress = false;
  }

  function checkForEnquedRequests(recursiveCheck?: boolean) {
    // TODO
    let nextRequest: PendingRequest;

    if (enquedRequests.length > 0) {
      nextRequest = enquedRequests.splice(0, 1)[0];
      delayForScryfallDesignatedTime().then(function () {
        nextRequest.start();
      });
    } else if (recursiveCheck) {
      requestInProgress = false;
    } else {
      delayForScryfallDesignatedTime().then(function () {
        checkForEnquedRequests(true);
      });
    }
  }

  function prepareRequest(
    url: string,
    options: RequestOptions
  ): PendingRequest {
    let pendingResolveFunction: Function, pendingRejectFunction: Function;

    return {
      pending: function () {
        return new Promise(function (resolve, reject) {
          pendingResolveFunction = resolve;
          pendingRejectFunction = reject;
        });
      },
      start: function () {
        return sendRequest(url, options)
          .then(function (body) {
            try {
              // eslint-disable-next-line @typescript-eslint/no-use-before-define
              pendingResolveFunction(wrapFunction(body));
            } catch (err) {
              return Promise.reject(
                new ScryfallError({
                  message:
                    "Something went wrong when wrapping the response from Scryfall",
                  thrownError: err,
                })
              );
            }
          })
          .catch(function (err) {
            if (!(err instanceof ScryfallError)) {
              err = new ScryfallError({
                message:
                  "An unexpected error occurred when requesting resources from Scryfall.",
                status: err.status,
                originalError: err,
              });
            }

            pendingRejectFunction(err);
          })
          .then(function () {
            checkForEnquedRequests();
          });
      },
    };
  }

  const requestFunction = function request(
    endpoint: string,
    options?: RequestOptions
  ) {
    let url, queryParams;

    options = options || {};

    if (isFullScryfallUrl(endpoint)) {
      url = endpoint;
    } else {
      if (endpointBeginsWithSlash(endpoint)) {
        endpoint = endpoint.substring(1);
      }
      url = SCRYFALL_API_ENDPOINT + endpoint;
    }

    if (options.query) {
      queryParams = querystring.stringify(options.query);

      if (url.indexOf("?") > -1) {
        url += "&";
      } else {
        url += "?";
      }

      url += queryParams;
    }

    const pendingRequestHandler = prepareRequest(url, options);
    const pendingRequest = pendingRequestHandler.pending();

    if (!requestInProgress) {
      requestInProgress = true;
      pendingRequestHandler.start();
    } else {
      enquedRequests.push(pendingRequestHandler);
    }

    return pendingRequest;
  };

  function wrapFunction(body: ScryfallResponse) {
    const wrapOptions = {
      requestMethod: requestFunction,
    } as ModelConfig;

    if (options.textTransformer) {
      wrapOptions.textTransformer = options.textTransformer;
    } else if (options.convertSymbolsToSlackEmoji) {
      wrapOptions.textTransformer = convertSymbolsToEmoji.slack;
    } else if (options.convertSymbolsToDiscordEmoji) {
      wrapOptions.textTransformer = convertSymbolsToEmoji.discord;
    }
    return wrapScryfallResponse(body, wrapOptions);
  }

  requestFunction.wrapFunction = wrapFunction;
  requestFunction.clearQueue = clearQueue;

  return requestFunction;
}

export default makeRequestFunction;
