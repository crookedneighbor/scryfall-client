"use strict";

import ArrayLike from "./array-like";
import type { ScryfallList } from "Types/api/response";
import type { ModelConfig } from "Types/model-config";

export default class List extends ArrayLike {
  // From https://scryfall.com/docs/api/lists
  // omitting data since it becomes an entry in the array like structure
  object: "list";
  has_more: boolean; // True if this List is paginated and there is a page beyond the current page.
  next_page?: URL; // If there is a page beyond the current page, this field will contain a full API URI to that page. You may submit a HTTP GET request to that URI to continue paginating forward on this List.
  total_cards?: number; // If this is a list of Card objects, this field will contain the total number of cards found across all pages.
  warnings?: string[]; // An array of human-readable warnings issued when generating this list, as strings. Warnings are non-fatal issues that the API discovered with your input. In general, they indicate that the List will not contain the all of the information you requested. You should fix the warnings and re-submit your request.

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
