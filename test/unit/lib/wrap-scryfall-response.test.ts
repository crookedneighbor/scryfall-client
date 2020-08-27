"use strict";

import wrapScryfallResponse, {
  setTextTransform,
  resetTextTransform,
} from "Lib/wrap-scryfall-response";
import fixtures from "Fixtures";
import Card from "Models/card";
import MagicSet from "Models/magic-set";
import GenericScryfallResponse from "Models/generic-scryfall-response";

describe("wrapScryfallResponse", function () {
  afterEach(() => {
    resetTextTransform();
  });

  it("wraps generic objects with GenericScryfallResponse", function () {
    const wrappedResponse = wrapScryfallResponse({
      object: "card_symbol",
      symbol: "Symbol String",
      english: "english",
      transposable: false,
      represents_mana: false,
      appears_in_mana_costs: false,
      funny: false,
      colors: [],
    });

    expect(wrappedResponse).toBeInstanceOf(GenericScryfallResponse);
  });

  it("wraps card responses in Card", function () {
    const wrappedResponse = wrapScryfallResponse(fixtures.card);

    expect(wrappedResponse).toBeInstanceOf(Card);
    expect(wrappedResponse.id).toBe("357cf802-2d66-49a4-bf43-ab3bc30ab825");
  });

  it("wraps list responses in List", function () {
    const wrappedResponse = wrapScryfallResponse(fixtures.listOfCards);

    expect(wrappedResponse).toBeInstanceOf(Array);
    expect(wrappedResponse.length).toBe(2);
    expect(wrappedResponse[0]).toBeInstanceOf(Card);
    expect(wrappedResponse[1]).toBeInstanceOf(Card);
  });

  it("wraps catalog responses in Catalog", function () {
    const wrappedResponse = wrapScryfallResponse(fixtures.catalogOfCardNames);

    expect(wrappedResponse).toBeInstanceOf(Array);
    expect(wrappedResponse.length).toBe(20);
  });

  it("wraps set responses in MagicSet", function () {
    const wrappedResponse = wrapScryfallResponse(fixtures.set);

    expect(wrappedResponse).toBeInstanceOf(MagicSet);
    expect(wrappedResponse.code).toBe("chk");
  });

  it("wraps nested properties", function () {
    const wrappedResponse = wrapScryfallResponse(
      fixtures.cardWithMultipleTokens
    );

    expect(wrappedResponse).toBeInstanceOf(Card);
    expect(wrappedResponse.image_uris.small).toContain("c1.scryfall.com");
    expect(wrappedResponse.all_parts[0]).toBeInstanceOf(
      GenericScryfallResponse
    );
  });

  it("can set a text transformer function", function () {
    setTextTransform((text) => {
      return text.replace("{t}", "TAP!");
    });

    expect(wrapScryfallResponse("Foo {t} bar")).toBe("Foo TAP! bar");
  });

  it("can use a text transformer in nested objects", function () {
    const card = JSON.parse(JSON.stringify(fixtures.cardWithMultipleTokens));
    card.all_parts[1].component = "{F} FOO";

    setTextTransform((text) => {
      const replacement = text.replace(/{([\w\d]*)}/g, "<$1>");

      return replacement.toUpperCase();
    });

    const wrappedResponse = wrapScryfallResponse(card);

    expect(wrappedResponse.mana_cost).toBe("<3><G><G>");
    expect(wrappedResponse.all_parts[1].component).toBe("<F> FOO");
  });

  it("does not convert symbols to slack or discord emoji if not explicitly passed in", function () {
    const wrappedResponse = wrapScryfallResponse(fixtures.card);

    expect(wrappedResponse.mana_cost).toBe("{2}{U}");
  });
});
