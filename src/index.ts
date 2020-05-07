"use strict";

import request from "Lib/api-request";
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
import type { ApiResponse } from "Types/api-response";

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

// TODO return model type
// TODO no any
function get(url: string, query?: Record<string, any>) {
  return request({
    endpoint: url,
    method: "get",
    query,
  });
}

// TODO return model type
// TODO no any
function post(url: string, body?: Record<string, any>) {
  return request({
    endpoint: url,
    method: "post",
    body,
  });
}

function getSymbolUrl(symbol: string): string {
  const match = symbol.match(/{?(.)}?/);
  const character = match ? match[1] : symbol;

  return "https://img.scryfall.com/symbology/" + character + ".svg";
}

// TODO return model type
function wrap(body: ApiResponse) {
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
