"use strict";

const GenericScryfallResponse = require("../../../models/generic-scryfall-response");

describe("GenericScryfallResponse", function () {
  it("does not throw for valid response object", function () {
    expect(() => {
      // eslint-disable-next-line no-new
      new GenericScryfallResponse({
        object: "type",
      });
    }).not.toThrowError();
  });

  it("throws an error if there is no object property", function () {
    expect(() => {
      // eslint-disable-next-line no-new
      new GenericScryfallResponse({
        otherProp: "value",
      });
    }).toThrowError("Generic Scryfall response must have an object property");
  });
});
