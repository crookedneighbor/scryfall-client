"use strict";

import SingularEntity from "Models/singular-entity";

import type { ApiResponse } from "Types/api-response";
import type { ModelConfig } from "Types/model-config";

interface SetResponse extends ApiResponse {
  object: "set";
}

export default class Set extends SingularEntity {
  // Properties from https://scryfall.com/docs/api/sets
  // that the class actively uses
  search_uri: URL; // A Scryfall API URI that you can request to begin paginating over the cards in this set.

  constructor(scryfallObject: SetResponse, config: ModelConfig) {
    super(scryfallObject, config);

    this.search_uri = scryfallObject.search_uri;
  }

  getCards() {
    return this._request(this.search_uri!);
  }
}
