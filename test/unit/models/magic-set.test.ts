"use strict";

import MagicSet from "../../../src/models/magic-set";
import Card from "../../../src/models/card";
import wrapScryfallResponse from "../../../src/lib/wrap-scryfall-response";
import { get } from "../../../src/lib/api-request";
import { listOfCardsFixture, setFixture } from "../../fixtures";

vi.mock("../../../src/lib/api-request");

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
      fakeRequest.mockResolvedValue(wrapScryfallResponse(listOfCardsFixture));
      set = wrapScryfallResponse(setFixture);
    });

    it("gets cards for set", function () {
      return set.getCards().then((cards: Card[]) => {
        expect(typeof listOfCardsFixture.data[0].name).toBe("string");
        expect(fakeRequest).toBeCalledWith(setFixture.search_uri);
        expect(cards[0].name).toBe(listOfCardsFixture.data[0].name);
        expect(cards.length).toBe(listOfCardsFixture.data.length);
      });
    });
  });
});
