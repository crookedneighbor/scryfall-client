"use strict";

import { get, post } from "./lib/api-request";
import {
  setTaskDelayTime,
  resetTaskDelayTime,
} from "./lib/api-request/enque-task";
import wrapScryfallResponse, {
  setTextTransform as wrapTransform,
  resetTextTransform as wrapReset,
} from "./lib/wrap-scryfall-response";
import {
  slack as slackTransformer,
  discord as discordTransformer,
} from "./lib/convert-symbols-to-emoji";

import {
  autocomplete,
  random,
  search,
  getCollection,
  getCard,
  getCardNamed,
  getCardBySetCodeAndCollectorNumber,
} from "./api-routes/cards";
import { getSets, getSet, getSetByTcgId } from "./api-routes/sets";
import { getCatalog } from "./api-routes/catalog";

import symbology from "./lib/fixtures/symbology";

import type { TextTransformFunction } from "./types/text-transform";
import type {
  ApiResponse,
  ListApiResponse,
  CatalogApiResponse,
} from "./types/api-response";
import type CardApiResponse from "./types/api/card";
import type SetApiResponse from "./types/api/set";
import type { Model } from "./types/model";
import type SingularEntity from "./models/singular-entity";
import type CardSymbol from "./models/card-symbol";
import type Card from "./models/card";
import type List from "./models/list";
import type Catalog from "./models/catalog";
import type MagicSet from "./models/magic-set";

function setTextTransform(func: TextTransformFunction): void {
  wrapTransform(func);
}

function slackify(): void {
  wrapTransform(slackTransformer);
}

function discordify(): void {
  wrapTransform(discordTransformer);
}

function resetTextTransform(): void {
  wrapReset();
}

function setApiRequestDelayTime(waitTime: number): void {
  setTaskDelayTime(waitTime);
}

function resetApiRequestDelayTime(): void {
  resetTaskDelayTime();
}

function getSymbolUrl(symbol: string): string {
  const match = symbol.match(/{?([^{}]+)}?/);
  const character = (match ? match[1] : symbol).toUpperCase();
  const url = symbology[character] as string;

  if (!url) {
    throw new Error(
      `Symbol "${symbol}" not found. The scryfall-client module may need an update.`
    );
  }

  return url;
}

function wrap(body: CardApiResponse): Card;
function wrap(body: ListApiResponse): List<SingularEntity>;
function wrap(body: SetApiResponse): MagicSet;
function wrap(body: CatalogApiResponse): Catalog;
function wrap(body: ApiResponse): Model {
  return wrapScryfallResponse(body);
}

export = {
  setApiRequestDelayTime,
  resetApiRequestDelayTime,
  setTextTransform,
  slackify,
  discordify,
  resetTextTransform,
  getSymbolUrl,
  get,
  post,
  wrap,
  getSets,
  getSet,
  getSetByTcgId,
  search,
  autocomplete,
  random,
  getCollection,
  getCard,
  getCardNamed,
  getCardBySetCodeAndCollectorNumber,
  getCatalog,
};
