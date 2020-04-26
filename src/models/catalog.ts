"use strict";

import { ApiResponse } from "Types/api-response";
import ArrayLike from "./array-like";

interface CatalogResponse extends ApiResponse {
  object: "catalog";
  data: string[];
}

export default class Catalog extends ArrayLike {
  // From https://scryfall.com/docs/api/catalogs
  // omitting data since it becomes an entry in the array like structure
  object: "catalog";
  uri: URL; // A link to the current catalog on Scryfall’s API.
  total_values: number; // The number of items in the data array.

  constructor(scrfallResponse: CatalogResponse) {
    super(scrfallResponse);

    this.object = scrfallResponse.object;
    this.uri = scrfallResponse.uri;
    this.total_values = scrfallResponse.total_values;
  }
}
