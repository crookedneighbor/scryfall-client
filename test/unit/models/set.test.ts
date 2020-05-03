"use strict";

import Set from "Models/set";
import Card from "Models/card";
import wrapScryfallResponse from "Lib/wrap-scryfall-response";
import request from "Lib/api-request";
import fixtures from "Fixtures";

import { mocked } from "ts-jest/utils";

jest.mock("Lib/api-request");

describe("Set", function () {
  let fakeRequest: jest.SpyInstance, set: Set;

  beforeEach(() => {
    fakeRequest = mocked(request);
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
        expect(fakeRequest).toBeCalledWith({
          endpoint: fixtures.set.search_uri,
        });
        expect(cards[0].name).toBe(fixtures.listOfCards.data[0].name);
        expect(cards.length).toBe(fixtures.listOfCards.data.length);
      });
    });
  });
});
