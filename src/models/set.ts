"use strict";

import { ScryfallSet } from "Types/api/set";
import type { ModelConfig } from "Types/model-config";

export default class Set extends ScryfallSet {
  _request: Function;

  constructor(scryfallObject: ScryfallSet, config: ModelConfig) {
    super();

    this._request = config.requestMethod;

    Object.assign(this, scryfallObject);
  }

  getCards() {
    return this._request(this.search_uri!);
  }
}
