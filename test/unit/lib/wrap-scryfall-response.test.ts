"use strict";

import wrapScryfallResponse from "Lib/wrap-scryfall-response";
import fixtures from "Fixtures";
import Card from "Models/card";
import Catalog from "Models/catalog";
import List from "Models/list";
import Set from "Models/set";
import GenericScryfallResponse from "Models/generic-scryfall-response";

import type { ModelConfig } from "Types/model-config";

describe("wrapScryfallResponse", function () {
  let fakeRequestObject: Function, options: ModelConfig;

  beforeEach(function () {
    fakeRequestObject = jest.fn().mockResolvedValue(null);
    options = {
      requestMethod: fakeRequestObject,
    };
  });

  it("wraps generic objects with GenericScryfallResponse", function () {
    const wrappedResponse = wrapScryfallResponse(
      {
        object: "card_symbol",
        symbol: "Symbol String",
        english: "english",
        transposable: false,
        represents_mana: false,
        appears_in_mana_costs: false,
        funny: false,
        colors: [],
      },
      options
    );

    expect(wrappedResponse).toBeInstanceOf(GenericScryfallResponse);
  });

  it("wraps card responses in Card", function () {
    const wrappedResponse = wrapScryfallResponse(fixtures.card, options);

    expect(wrappedResponse).toBeInstanceOf(Card);
    expect(wrappedResponse.id).toBe("357cf802-2d66-49a4-bf43-ab3bc30ab825");
  });

  it("wraps list responses in List", function () {
    const wrappedResponse = wrapScryfallResponse(fixtures.listOfCards, options);

    expect(wrappedResponse).toBeInstanceOf(Array);
    expect(wrappedResponse.length).toBe(2);
    expect(wrappedResponse[0]).toBeInstanceOf(Card);
    expect(wrappedResponse[1]).toBeInstanceOf(Card);
  });

  it("wraps catalog responses in Catalog", function () {
    const wrappedResponse = wrapScryfallResponse(
      fixtures.catalogOfCardNames,
      options
    );

    expect(wrappedResponse).toBeInstanceOf(Array);
    expect(wrappedResponse.length).toBe(20);
  });

  it("wraps set responses in Set", function () {
    const wrappedResponse = wrapScryfallResponse(fixtures.set, options);

    expect(wrappedResponse).toBeInstanceOf(Set);
    expect(wrappedResponse.code).toBe("chk");
  });

  it("wraps nested properties", function () {
    const wrappedResponse = wrapScryfallResponse(
      fixtures.cardWithMultipleTokens,
      options
    );

    expect(wrappedResponse).toBeInstanceOf(Card);
    expect(wrappedResponse.image_uris.small).toContain("img.scryfall.com");
    expect(wrappedResponse.all_parts[0]).toBeInstanceOf(
      GenericScryfallResponse
    );
  });

  it("can pass a text transformer function", function () {
    options.textTransformer = function (text) {
      return text.replace("{t}", "TAP!");
    };

    expect(wrapScryfallResponse("Foo {t} bar", options)).toBe("Foo TAP! bar");
  });

  it("can use a text transformer in nested objects", function () {
    const card = JSON.parse(JSON.stringify(fixtures.cardWithMultipleTokens));
    card.all_parts[1].component = "{F} FOO";

    options.textTransformer = function (text) {
      const replacement = text.replace(/{([\w\d]*)}/g, "<$1>");

      return replacement.toUpperCase();
    };

    const wrappedResponse = wrapScryfallResponse(card, options);

    expect(wrappedResponse.mana_cost).toBe("<3><G><G>");
    expect(wrappedResponse.all_parts[1].component).toBe("<F> FOO");
  });

  it("does not convert symbols to slack or discord emoji if not explicitly passed in", function () {
    const wrappedResponse = wrapScryfallResponse(fixtures.card, options);

    expect(wrappedResponse.mana_cost).toBe("{2}{U}");
  });
});
