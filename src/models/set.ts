"use strict";

import SingularEntity from "Models/singular-entity";

import type { ApiResponse } from "Types/api-response";
import type { ModelConfig } from "Types/model-config";

interface SetResponse extends ApiResponse {
  object: "set";
}

export default class Set extends SingularEntity {
  // from https://scryfall.com/docs/api/sets
  id: string; // A unique ID for this set on Scryfall that will not change.
  code: string; // The unique three to five-letter code for this set.
  mtgo_code?: string; // The unique code for this set on MTGO, which may differ from the regular code.
  tcgplayer_id?: number; // This set’s ID on TCGplayer’s API, also known as the groupId.
  name: string; // The English name of the set.
  set_type: string; // A computer-readable classification for this set. See below.
  released_at?: string; // The date the set was released or the first card was printed in the set (in GMT-8 Pacific time).
  block_code?: string; // The block code for this set, if any.
  block?: string; // The block or group name code for this set, if any.
  parent_set_code?: string; // The set code for the parent set, if any. promo and token sets often have a parent set.
  card_count: number; // The number of cards in this set.
  digital: boolean; // True if this set was only released on Magic Online.
  foil_only: boolean; // True if this set contains only foil cards.
  scryfall_uri: URL; // A link to this set’s permapage on Scryfall’s website.
  uri: URL; // A link to this set object on Scryfall’s API.
  icon_svg_uri: URL; // A URI to an SVG file for this set’s icon on Scryfall’s CDN. Hotlinking this image isn’t recommended, because it may change slightly over time. You should download it and use it locally for your particular user interface needs.
  search_uri: URL; // A Scryfall API URI that you can request to begin paginating over the cards in this set.

  constructor(scryfallObject: SetResponse, config: ModelConfig) {
    super(scryfallObject, config);

    this.id = scryfallObject.id;
    this.code = scryfallObject.code;
    this.mtgo_code = scryfallObject.mtgo_code;
    this.tcgplayer_id = scryfallObject.tcgplayer_id;
    this.name = scryfallObject.name;
    this.set_type = scryfallObject.set_type;
    this.released_at = scryfallObject.released_at;
    this.block_code = scryfallObject.block_code;
    this.block = scryfallObject.block;
    this.parent_set_code = scryfallObject.parent_set_code;
    this.card_count = scryfallObject.card_count;
    this.digital = scryfallObject.digital;
    this.foil_only = scryfallObject.foil_only;
    this.scryfall_uri = scryfallObject.scryfall_uri;
    this.uri = scryfallObject.uri;
    this.icon_svg_uri = scryfallObject.icon_svg_uri;
    this.search_uri = scryfallObject.search_uri;
  }

  getCards() {
    return this._request(this.search_uri!);
  }
}
