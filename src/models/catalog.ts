"use strict";

import { CatalogApiResponse } from "Types/api-response";
import ArrayLike from "./array-like";

export default class Catalog extends ArrayLike<string> {
  // From https://scryfall.com/docs/api/catalogs
  // omitting data since it becomes an entry in the array like structure
  object: "catalog";
  uri: URL; // A link to the current catalog on Scryfall’s API.
  total_values: number; // The number of items in the data array.

  constructor(scrfallResponse: CatalogApiResponse) {
    super(scrfallResponse);

    this.object = scrfallResponse.object;
    this.uri = scrfallResponse.uri;
    this.total_values = scrfallResponse.total_values;
  }
}
