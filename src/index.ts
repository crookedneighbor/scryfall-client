"use strict";

import makeRequestFunction from "Lib/request";

type ScryfallClientOptions = {
  textTransformer?: (text: string) => string;
  convertSymbolsToSlackEmoji?: boolean;
  convertSymbolsToDiscordEmoji?: boolean;
  delayBetweenRequests?: number;
};

class ScryfallClient {
  _request: any;

  constructor(options?: ScryfallClientOptions) {
    this._request = makeRequestFunction(options);
  }

  get(url: string, query?: Record<string, any>) {
    return this._request(url, {
      method: "get",
      query,
    });
  }

  post(url: string, body?: Record<string, any>) {
    return this._request(url, {
      body,
      method: "post",
    });
  }

  getSymbolUrl(symbol: string) {
    const match = symbol.match(/{?(.)}?/);
    const character = match ? match[1] : symbol;

    return "https://img.scryfall.com/symbology/" + character + ".svg";
  }

  wrap(body: any) {
    return this._request.wrapFunction(body);
  }
}

export = ScryfallClient;
