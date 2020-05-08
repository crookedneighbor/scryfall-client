"use strict";

import { get, post } from "Lib/api-request";
import {
  setTaskDelayTime,
  resetTaskDelayTime,
} from "Lib/api-request/enque-task";
import wrapScryfallResponse, {
  setTextTransform as wrapTransform,
  resetTextTransform as wrapReset,
} from "Lib/wrap-scryfall-response";
import {
  slack as slackTransformer,
  discord as discordTransformer,
} from "Lib/convert-symbols-to-emoji";

import type { TextTransformFunction } from "Types/text-transform";
import type {
  ApiResponse,
  CardApiResponse,
  ListApiResponse,
  SetApiResponse,
  CatalogApiResponse,
} from "Types/api-response";
import type { Model } from "Types/model";
import type SingularEntity from "Models/singular-entity";
import type Card from "Models/card";
import type List from "Models/list";
import type Catalog from "Models/catalog";
import type MagicSet from "Models/magic-set";

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
  const match = symbol.match(/{?(.)}?/);
  const character = match ? match[1] : symbol;

  return "https://img.scryfall.com/symbology/" + character + ".svg";
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
};
