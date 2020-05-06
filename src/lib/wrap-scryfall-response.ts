"use strict";

import Card from "Models/card";
import Catalog from "Models/catalog";
import List from "Models/list";
import MagicSet from "Models/magic-set";
import GenericScryfallResponse from "Models/generic-scryfall-response";

import { TextTransformFunction } from "Types/text-transform";

let transformFunction: TextTransformFunction;

const noopTransformFunction = (text: string): string => {
  // noop by default
  return text;
};

export function setTextTransform(func: TextTransformFunction): void {
  transformFunction = func;
}
export function resetTextTransform(): void {
  setTextTransform(noopTransformFunction);
}

resetTextTransform();

// TODO not any
// TODO returns a model
export default function wrapScryfallResponse(response: any) {
  // TODO not any
  let wrappedResponse: any;

  if (typeof response === "string") {
    return transformFunction(response);
  }

  if (!response || typeof response !== "object") {
    return response;
  }

  if (!response.object) {
    wrappedResponse = response;
  } else if (response.object === "card") {
    wrappedResponse = new Card(response);
  } else if (response.object === "list") {
    wrappedResponse = new List(response);
  } else if (response.object === "catalog") {
    wrappedResponse = new Catalog(response);
  } else if (response.object === "set") {
    wrappedResponse = new MagicSet(response);
  } else {
    wrappedResponse = new GenericScryfallResponse(response);
  }

  if (response.object === "list") {
    // TODO not any, kind of model
    wrappedResponse.forEach(function (object: any, location: number) {
      wrappedResponse[location] = wrapScryfallResponse(object);
    });
  } else {
    Object.keys(response).forEach(function (key) {
      wrappedResponse[key] = wrapScryfallResponse(response[key]);
    });
  }

  return wrappedResponse;
}
