"use strict";

import ArrayLike from "./array-like";
import type { ScryfallList } from "Types/api/response";
import type { ModelConfig } from "Types/model-config";

export default class List extends ArrayLike {
  // Got to duplicate this from the ScryfallList type
  // since List inherits from ArrayLike
  object: "list";
  has_more: boolean;
  next_page?: URL;
  total_cards?: number;
  warnings?: string[];

  _request: Function;

  constructor(scrfallResponse: ScryfallList, config: ModelConfig) {
    super(scrfallResponse);

    this.object = scrfallResponse.object;
    this.has_more = scrfallResponse.has_more;
    this.next_page = scrfallResponse.next_page;
    this.total_cards = scrfallResponse.total_cards;
    this.warnings = scrfallResponse.warnings;
    this._request = config.requestMethod;
  }

  next(): Promise<List> {
    if (!this.has_more) {
      return Promise.reject(new Error("No additional pages."));
    }

    return this._request(this.next_page as URL);
  }
}
