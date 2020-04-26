"use strict";

import Card from "Models/card";
import Catalog from "Models/catalog";
import List from "Models/list";
import Set from "Models/set";
import GenericScryfallResponse from "Models/generic-scryfall-response";

import type { ScryfallResponse } from "Types/api/response";
import type { ModelConfig } from "Types/model-config";

export default function wrapScryfallResponse(
  response: any, // TODO any
  options: ModelConfig
) {
  // TODO not any
  let wrappedResponse: any;

  if (typeof response === "string" && options.textTransformer) {
    response = options.textTransformer(response);
  }

  if (!response || typeof response !== "object") {
    return response;
  }

  const requestMethod = options.requestMethod;
  const modelOptions = {
    textTransformer: options.textTransformer,
    requestMethod,
  };

  if (!response.object) {
    wrappedResponse = response;
  } else if (response.object === "card") {
    wrappedResponse = new Card(response, modelOptions);
  } else if (response.object === "list") {
    wrappedResponse = new List(response, modelOptions);
  } else if (response.object === "catalog") {
    wrappedResponse = new Catalog(response);
  } else if (response.object === "set") {
    wrappedResponse = new Set(response, modelOptions);
  } else {
    wrappedResponse = new GenericScryfallResponse(response);
  }

  if (response.object === "list") {
    wrappedResponse.forEach(function (object: any, location: number) {
      wrappedResponse[location] = wrapScryfallResponse(object, options);
    });
  } else {
    Object.keys(response).forEach(function (key) {
      wrappedResponse[key] = wrapScryfallResponse(response[key], options);
    });
  }

  return wrappedResponse;
}
