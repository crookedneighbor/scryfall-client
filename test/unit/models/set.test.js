"use strict";

const Set = require("../../../models/set");
const wrapScryfallResponse = require("../../../lib/wrap-scryfall-response");
const fixtures = require("../../fixtures");

describe("Set", function () {
  let fakeRequestMethod, config, set;

  beforeEach(function () {
    fakeRequestMethod = jest.fn();
    config = {
      requestMethod: fakeRequestMethod,
    };
  });

  it('does not throw if object type is "set"', function () {
    expect(() => {
      new Set(fixtures.set, config); // eslint-disable-line no-new
    }).not.toThrowError();
  });

  it('throws if object type is not "set"', function () {
    expect(() => {
      new Set(fixtures.listOfRulings, config); // eslint-disable-line no-new
    }).toThrowError('Object type must be "set"');
  });

  describe("getCards", function () {
    beforeEach(function () {
      fakeRequestMethod.mockResolvedValue(
        wrapScryfallResponse(fixtures.listOfCards, {
          requestMethod: fakeRequestMethod,
        })
      );
      set = wrapScryfallResponse(fixtures.set, {
        requestMethod: fakeRequestMethod,
      });
    });

    it("gets cards for set", function () {
      return set.getCards().then((cards) => {
        expect(typeof fixtures.listOfCards.data[0].name).toBe("string");
        expect(fakeRequestMethod).toBeCalledWith(fixtures.set.search_uri);
        expect(cards[0].name).toBe(fixtures.listOfCards.data[0].name);
        expect(cards.length).toBe(fixtures.listOfCards.data.length);
      });
    });
  });
});
