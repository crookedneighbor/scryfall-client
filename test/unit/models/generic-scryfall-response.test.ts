"use strict";

import GenericScryfallResponse from "Models/generic-scryfall-response";

describe("GenericScryfallResponse", function () {
  it("accepts a Scryfall response object", function () {
    expect(() => {
      // eslint-disable-next-line no-new
      new GenericScryfallResponse(
        {
          object: "ruling",
          oracle_id: "id",
          source: "wotc",
          published_at: "2010-10-10",
          comment: "Text of ruling",
        },
        {
          requestMethod: jest.fn(),
        }
      );
    }).not.toThrow();
  });
});
