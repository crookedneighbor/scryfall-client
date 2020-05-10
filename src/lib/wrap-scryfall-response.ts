"use strict";

import type SingularEntity from "Models/singular-entity";
import Card from "Models/card";
import Catalog from "Models/catalog";
import List from "Models/list";
import MagicSet from "Models/magic-set";
import GenericScryfallResponse from "Models/generic-scryfall-response";
import type { Model } from "Types/model";
import type {
  ApiResponse,
  ListApiResponse,
  CatalogApiResponse,
} from "Types/api-response";
import CardApiResponse from "Types/api/card";
import SetApiResponse from "Types/api/set";

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

type passthrough<T> = (arg: T) => (c: T) => T;

function wrapScryfallResponse<T>(response: T): T;
function wrapScryfallResponse(body: ApiResponse): Model;
function wrapScryfallResponse(body: CardApiResponse): Card;
function wrapScryfallResponse(body: ListApiResponse): List<SingularEntity>;
function wrapScryfallResponse(body: SetApiResponse): MagicSet;
function wrapScryfallResponse(body: CatalogApiResponse): Catalog;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapScryfallResponse(response: any): any {
  if (typeof response === "string") {
    return transformFunction(response);
  }

  if (!response || typeof response !== "object") {
    return response;
  }

  if (response.object === "list" || response.object === "catalog") {
    response.data = response.data.map(wrapScryfallResponse);

    if (response.object === "list") {
      return new List(response);
    } else if (response.object === "catalog") {
      return new Catalog(response);
    }
  }

  Object.keys(response).forEach(function (key) {
    response[key] = wrapScryfallResponse(response[key]);
  });

  if (response.object === "card") {
    return new Card(response);
  } else if (response.object === "set") {
    return new MagicSet(response);
  } else if (response.object) {
    return new GenericScryfallResponse(response);
  }

  return response;
}

export default wrapScryfallResponse;
