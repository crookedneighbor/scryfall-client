"use strict";

import SingularEntity from "Models/singular-entity";
import type List from "Models/list";
import request from "Lib/api-request";

import type { ApiResponse } from "Types/api-response";

interface SetResponse extends ApiResponse {
  object: "set";
}

export default class Set extends SingularEntity {
  // Properties from https://scryfall.com/docs/api/sets
  // that the class actively uses
  search_uri: string; // A Scryfall API URI that you can request to begin paginating over the cards in this set.

  constructor(scryfallObject: SetResponse) {
    super(scryfallObject);

    this.search_uri = scryfallObject.search_uri;
  }

  getCards(): Promise<List> {
    return request({
      endpoint: this.search_uri as string,
    });
  }
}
