"use strict";

import GenericScryfallResponse from "Models/generic-scryfall-response";

describe("GenericScryfallResponse", function () {
  it("accepts a Scryfall response object", function () {
    expect(() => {
      new GenericScryfallResponse({
        object: "ruling",
        oracle_id: "id",
        source: "wotc",
        published_at: "2010-10-10",
        comment: "Text of ruling",
      });
    }).not.toThrow();
  });
});
