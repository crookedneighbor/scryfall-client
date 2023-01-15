"use strict";

import MagicSet from "Models/magic-set";
import Card from "Models/card";
import wrapScryfallResponse from "Lib/wrap-scryfall-response";
import { get } from "Lib/api-request";
import fixtures from "Fixtures";

vi.mock("Lib/api-request");

describe("Set", function () {
  let fakeRequest: vi.SpyInstance, set: MagicSet;

  beforeEach(() => {
    fakeRequest = vi.mocked(get);
  });

  afterEach(() => {
    fakeRequest.mockReset();
  });

  describe("getCards", function () {
    beforeEach(function () {
      fakeRequest.mockResolvedValue(wrapScryfallResponse(fixtures.listOfCards));
      set = wrapScryfallResponse(fixtures.set);
    });

    it("gets cards for set", function () {
      return set.getCards().then((cards: Card[]) => {
        expect(typeof fixtures.listOfCards.data[0].name).toBe("string");
        expect(fakeRequest).toBeCalledWith(fixtures.set.search_uri);
        expect(cards[0].name).toBe(fixtures.listOfCards.data[0].name);
        expect(cards.length).toBe(fixtures.listOfCards.data.length);
      });
    });
  });
});
