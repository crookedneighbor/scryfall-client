"use strict";

import Set from "Models/set";
import Card from "Models/card";
import wrapScryfallResponse from "Lib/wrap-scryfall-response";
import fixtures from "Fixtures";
import type { ModelConfig } from "Types/model-config";

describe("Set", function () {
  let fakeRequestMethod: any, config: ModelConfig, set: Set;

  beforeEach(function () {
    fakeRequestMethod = jest.fn();
    config = {
      requestMethod: fakeRequestMethod,
    };
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
      return set.getCards().then((cards: Card[]) => {
        expect(typeof fixtures.listOfCards.data[0].name).toBe("string");
        expect(fakeRequestMethod).toBeCalledWith(fixtures.set.search_uri);
        expect(cards[0].name).toBe(fixtures.listOfCards.data[0].name);
        expect(cards.length).toBe(fixtures.listOfCards.data.length);
      });
    });
  });
});
