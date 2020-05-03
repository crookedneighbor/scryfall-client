"use strict";

import request from "Lib/api-request";
import wrapScryfallResponse, {
  setTextTransform,
} from "Lib/wrap-scryfall-response";

import { TextTransformFunction } from "Types/text-transform";

type ScryfallClientOptions = {
  textTransformer?: (text: string) => string;
  convertSymbolsToSlackEmoji?: boolean;
  convertSymbolsToDiscordEmoji?: boolean;
  delayBetweenRequests?: number;
};

class ScryfallClient {
  constructor(options?: ScryfallClientOptions) {
    // this._request = request;
  }

  static setTextTransform(func: TextTransformFunction): void {
    setTextTransform(func);
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
