"use strict";

import { ScryfallCatalog } from "Types/api/catalog";
import ArrayLike from "./array-like";

export default class Catalog extends ArrayLike {
  // Got to duplicate this from the ScryfallCatalog type
  // since Catalog inherits from ArrayLike
  public object: "catalog";
  public uri: URL;
  public total_values: number;

  constructor(scrfallResponse: ScryfallCatalog) {
    super(scrfallResponse);

    this.object = scrfallResponse.object;
    this.uri = scrfallResponse.uri;
    this.total_values = scrfallResponse.total_values;
  }
}
