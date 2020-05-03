"use strict";

import request from "Lib/api-request";
import {
  setTaskDelayTime,
  resetTaskDelayTime,
} from "Lib/api-request/enque-task";
import wrapScryfallResponse, {
  setTextTransform,
  resetTextTransform,
} from "Lib/wrap-scryfall-response";
import {
  slack as slackTransformer,
  discord as discordTransformer,
} from "Lib/convert-symbols-to-emoji";

import { TextTransformFunction } from "Types/text-transform";

class ScryfallClient {
  static setTextTransform(func: TextTransformFunction): void {
    setTextTransform(func);
  }

  static slackify() {
    ScryfallClient.setTextTransform(slackTransformer);
  }

  static discordify() {
    ScryfallClient.setTextTransform(discordTransformer);
  }

  static resetTextTransform(): void {
    resetTextTransform();
  }

  static setApiRequestDelayTime(waitTime: number): void {
    setTaskDelayTime(waitTime);
  }

  static resetApiRequestDelayTime(): void {
    resetTaskDelayTime();
  }

  get(url: string, query?: Record<string, any>) {
    return request({
      endpoint: url,
      method: "get",
      query,
    });
  }

  post(url: string, body?: Record<string, any>) {
    return request({
      endpoint: url,
      method: "post",
      body,
    });
  }

  getSymbolUrl(symbol: string) {
    const match = symbol.match(/{?(.)}?/);
    const character = match ? match[1] : symbol;

    return "https://img.scryfall.com/symbology/" + character + ".svg";
  }

  wrap(body: any) {
    return wrapScryfallResponse(body);
  }
}

export = ScryfallClient;
