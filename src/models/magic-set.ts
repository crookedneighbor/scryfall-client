"use strict";

import SingularEntity from "Models/singular-entity";
import type Card from "Models/card";
import type List from "Models/list";
import request from "Lib/api-request";

import type { SetApiResponse } from "Types/api-response";

export default class MagicSet extends SingularEntity {
  // Properties from https://scryfall.com/docs/api/sets
  // that the class actively uses
  search_uri: string; // A Scryfall API URI that you can request to begin paginating over the cards in this set.

  constructor(scryfallObject: SetApiResponse) {
    super(scryfallObject);

    this.search_uri = scryfallObject.search_uri;
  }

  getCards(): Promise<List<Card>> {
    return request({
      endpoint: this.search_uri as string,
    });
  }
}
