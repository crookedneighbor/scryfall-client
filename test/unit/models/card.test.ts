"use strict";

import Card from "Models/card";
import List from "Models/list";
import MagicSet from "Models/magic-set";
import GenericScryfallResponse from "Models/generic-scryfall-response";
import { get } from "Lib/api-request";
import wrapScryfallResponse from "Lib/wrap-scryfall-response";
import fixtures from "Fixtures";

vi.mock("Lib/api-request");

describe("Card", function () {
  let fakeRequest, card: Card;

  beforeEach(() => {
    fakeRequest = vi.mocked(get);
  });

  it("normalizes card faces", function () {
    const cardWithoutFaces = new Card(fixtures.card);
    const cardWithFaces = new Card(fixtures.cardWithTransformLayout);
    const cardWithFlavorNameOnMultipleFaces = new Card(
      fixtures.cardWithFlavorNameOnMultipleFaces
    );

    expect(cardWithoutFaces.card_faces).not.toBe(fixtures.card.card_faces);
    expect(cardWithoutFaces.card_faces.length).toBe(1);
    expect(cardWithoutFaces.card_faces[0]).toEqual({
      object: "card_face",
      oracle_id: "08becc07-28bc-4a2f-a6b0-28a2998d2f50",
      name: cardWithoutFaces.name,
      mana_cost: cardWithoutFaces.mana_cost,
      flavor_text: cardWithoutFaces.flavor_text,
      colors: cardWithoutFaces.colors,
      oracle_text: cardWithoutFaces.oracle_text,
      type_line: cardWithoutFaces.type_line,
      artist: cardWithoutFaces.artist,
      image_uris: cardWithoutFaces.image_uris,
      illustration_id: cardWithoutFaces.illustration_id,
    });

    expect(cardWithFaces.card_faces.length).toBe(2);
    expect(cardWithFaces.card_faces).toBe(
      fixtures.cardWithTransformLayout.card_faces
    );

    expect(cardWithFlavorNameOnMultipleFaces.flavor_name).toBe(
      fixtures.cardWithFlavorNameOnMultipleFaces.card_faces[0].flavor_name +
        " // " +
        cardWithFlavorNameOnMultipleFaces.card_faces[1].flavor_name
    );
  });

  describe("getRulings", function () {
    beforeEach(function () {
      fakeRequest.mockResolvedValue(
        wrapScryfallResponse(fixtures.listOfRulings)
      );
      card = new Card(fixtures.card);
    });

    it("gets rulings for card", function () {
      return card
        .getRulings()
        .then((rulings: List<GenericScryfallResponse>) => {
          expect(typeof fixtures.card.rulings_uri).toBe("string");
          expect(get).toBeCalledTimes(1);
          expect(get).toBeCalledWith(fixtures.card.rulings_uri);
          expect(rulings[0].comment).toBe(
            fixtures.listOfRulings.data[0].comment
          );
        });
    });
  });

  describe("getSet", function () {
    beforeEach(function () {
      fakeRequest.mockResolvedValue(fixtures.set);
      card = new Card(fixtures.card);
    });

    it("gets set for card", function () {
      return card.getSet().then((set: MagicSet) => {
        expect(typeof fixtures.card.set_uri).toBe("string");
        expect(get).toBeCalledWith(fixtures.card.set_uri);
        expect(set.code).toBe(fixtures.set.code);
      });
    });
  });

  describe("getPrints", function () {
    beforeEach(function () {
      fakeRequest.mockResolvedValue(
        wrapScryfallResponse(fixtures.listOfPrints)
      );
      card = new Card(fixtures.card);
    });

    it("gets prints for card", function () {
      return card.getPrints().then((prints) => {
        expect(typeof fixtures.listOfPrints.data[0].name).toBe("string");
        expect(get).toBeCalledWith(fixtures.card.prints_search_uri);
        expect(prints[0].name).toBe(fixtures.listOfPrints.data[0].name);
        expect(prints.length).toBe(fixtures.listOfPrints.data.length);
      });
    });
  });

  describe("isLegal", function () {
    beforeEach(function () {
      card = new Card(fixtures.card);
    });

    it("returns true for legal card in provided format", function () {
      card.legalities.commander = "legal";

      expect(card.isLegal("commander")).toBe(true);
    });

    it("returns true for restricted card in provided format", function () {
      card.legalities.vintage = "restricted";

      expect(card.isLegal("vintage")).toBe(true);
    });

    it("returns false for illegal card in provided format", function () {
      card.legalities.modern = "not_legal";

      expect(card.isLegal("modern")).toBe(false);
    });

    it("returns false for banned card in provided format", function () {
      card.legalities.legacy = "banned";

      expect(card.isLegal("legacy")).toBe(false);
    });
  });

  describe("getImage", function () {
    it("returns with the specified image format for normal layout cards", function () {
      const card = new Card(fixtures.card);

      let img = card.getImage("normal");
      expect(typeof img).toBe("string");
      expect(img).toBe(fixtures.card.image_uris.normal);

      img = card.getImage("small");
      expect(typeof img).toBe("string");
      expect(img).toBe(fixtures.card.image_uris.small);
    });

    it("defaults to normal layout", function () {
      const card = new Card(fixtures.card);

      const img = card.getImage();
      expect(img).toBe(fixtures.card.image_uris.normal);
    });

    it("uses default face for transform card", function () {
      const card = new Card(fixtures.cardWithTransformLayout);

      const img = card.getImage();
      expect(typeof img).toBe("string");
      expect(img).toBe(
        fixtures.cardWithTransformLayout.card_faces[0].image_uris.normal
      );
    });

    it("gets image for flip card", function () {
      const card = new Card(fixtures.cardWithFlipLayout);

      const img = card.getImage();
      expect(typeof img).toBe("string");
      expect(img).toBe(fixtures.cardWithFlipLayout.image_uris.normal);
    });

    it("gets image for meld card", function () {
      const card = new Card(fixtures.cardWithMeldLayout);

      const img = card.getImage();
      expect(typeof img).toBe("string");
      expect(img).toBe(fixtures.cardWithMeldLayout.image_uris.normal);
    });

    it("rejects with an error if image uris cannot be found", function () {
      const card = new Card(fixtures.cardWithTransformLayout);

      const originalImgUris = card.card_faces[0].image_uris;
      delete card.card_faces[0].image_uris;

      expect(() => {
        card.getImage();
      }).toThrowError("Could not find image uris for card.");

      card.card_faces[0].image_uris = originalImgUris;
    });
  });

  describe("getBackImage", function () {
    it("returns with scryfall back image for normal layout cards", function () {
      const card = new Card(fixtures.card);

      const img = card.getBackImage();
      expect(img).toBe("http://cards.scryfall.io/back.png");
    });

    it("returns with the same scryfall back image for normal layout cards regardless of type passed in", function () {
      const card = new Card(fixtures.card);

      let img = card.getBackImage("normal");
      expect(img).toBe("http://cards.scryfall.io/back.png");

      img = card.getBackImage("small");
      expect(img).toBe("http://cards.scryfall.io/back.png");
    });

    it("rejects with an error if card does not have image uris", function () {
      const card = new Card(fixtures.cardWithTransformLayout);
      const oldImageUris = card.card_faces[1].image_uris;

      delete card.card_faces[1].image_uris;

      expect(() => {
        card.getBackImage();
      }).toThrowError(
        "An unexpected error occured when attempting to show back side of card."
      );

      card.card_faces[1].image_uris = oldImageUris;
    });

    it("uses back face for transform card", function () {
      const card = new Card(fixtures.cardWithTransformLayout);

      const img = card.getBackImage();
      expect(img).toBe(
        fixtures.cardWithTransformLayout.card_faces[1].image_uris.normal
      );
    });

    it("can specify size for back face for transform card", function () {
      const card = new Card(fixtures.cardWithTransformLayout);

      const img = card.getBackImage("small");
      expect(img).toBe(
        fixtures.cardWithTransformLayout.card_faces[1].image_uris.small
      );
    });

    it("gives the back card image for flip card", function () {
      const card = new Card(fixtures.cardWithFlipLayout);

      const img = card.getBackImage();
      expect(img).toBe("http://cards.scryfall.io/back.png");
    });
  });

  describe("getPrice", function () {
    let originalPrices: Record<string, string>;

    beforeEach(function () {
      card = new Card(fixtures.card);
      originalPrices = Object.assign({}, fixtures.card.prices);

      Object.keys(originalPrices).forEach((priceKind) => {
        // ensure that each price type in fixture exists
        expect(Boolean(originalPrices[priceKind])).toBe(true);
      });
    });

    afterEach(function () {
      fixtures.card.prices = originalPrices;
    });

    it("returns the non-foil usd price when no arguments are given", function () {
      expect(card.getPrice()).toBe(originalPrices.usd);
    });

    it("returns the specified version if given", function () {
      expect(card.getPrice("eur")).toBe(originalPrices.eur);
    });

    it("returns the foil price if no usd price is available and no argument is given", function () {
      card.prices.usd = null;

      expect(card.getPrice()).toBe(originalPrices.usd_foil);
    });

    it("returns the etched price if no usd or foil price is available and no argument is given", function () {
      card.prices.usd = null;
      card.prices.usd_foil = null;

      expect(card.getPrice()).toBe(originalPrices.usd_etched);
    });

    it("returns the eur price if no usd or foil or etched price available", function () {
      card.prices.usd = null;
      card.prices.usd_foil = null;
      card.prices.usd_etched = null;

      expect(card.getPrice()).toBe(originalPrices.eur);
    });

    it("returns foil eur price if no usd or eur price is available", function () {
      card.prices.usd = null;
      card.prices.usd_foil = null;
      card.prices.usd_etched = null;
      card.prices.eur = null;

      expect(card.getPrice()).toBe(originalPrices.eur_foil);
    });

    it("returns the tix price if no usd eur price available", function () {
      card.prices.usd = null;
      card.prices.usd_foil = null;
      card.prices.usd_etched = null;
      card.prices.eur = null;
      card.prices.eur_foil = null;

      expect(card.getPrice()).toBe(originalPrices.tix);
    });

    it("returns an empty string if no pricing is available", function () {
      card.prices.usd = null;
      card.prices.usd_foil = null;
      card.prices.usd_etched = null;
      card.prices.eur = null;
      card.prices.eur_foil = null;
      card.prices.tix = null;

      expect(card.getPrice()).toBe("");
    });

    it("returns an empty string if the specified type is not available", function () {
      card.prices.usd_foil = null;

      expect(card.getPrice("usd_foil")).toBe("");
    });
  });

  describe("getTokens", function () {
    beforeEach(function () {
      fakeRequest.mockResolvedValueOnce(
        wrapScryfallResponse(fixtures.tokens.elephant)
      );
      fakeRequest.mockResolvedValueOnce(
        wrapScryfallResponse(fixtures.tokens.wolf)
      );
      fakeRequest.mockResolvedValueOnce(
        wrapScryfallResponse(fixtures.tokens.snake)
      );
    });

    it("requests card objects for each token", function () {
      const card = new Card(fixtures.cardWithMultipleTokens);

      return card.getTokens().then((tokens: Card[]) => {
        expect(get).toBeCalledTimes(3);
        expect(get).toBeCalledWith(
          "https://api.scryfall.com/cards/2dbccfc7-427b-41e6-b770-92d73994bf3b"
        );
        expect(get).toBeCalledWith(
          "https://api.scryfall.com/cards/2a452235-cebd-4e8f-b217-9b55fc1c3830"
        );
        expect(get).toBeCalledWith(
          "https://api.scryfall.com/cards/7bdb3368-fee3-4795-a23f-c97555ee7475"
        );

        tokens.forEach((token: Card) => {
          expect(token).toBeInstanceOf(Card);
          expect(token.layout).toBe("token");
        });
      });
    });

    it("resolves with an empty array when card has no `all_parts` attribute and no tokens in rules text", function () {
      const card = new Card(fixtures.card);

      return card.getTokens().then((tokens: Card[]) => {
        expect(tokens).toEqual([]);
      });
    });

    it("looks up tokens from prints for card when card has no `all_parts` attribute, but rules text mentions token", function () {
      const list = wrapScryfallResponse(
        fixtures.listOfPrintsWithAndWithoutTokens
      ) as List<Card>;
      const card = list.find((c) => !c.all_parts);

      vi.spyOn(card, "getPrints").mockResolvedValue(
        wrapScryfallResponse({
          object: "list",
          data: [
            fixtures.cardWithTokenButNoParts,
            fixtures.cardWithMultipleTokens,
          ],
        })
      );

      return card.getTokens().then((tokens: Card[]) => {
        expect(card.getPrints).toBeCalledTimes(1);

        expect(get).toBeCalledTimes(3);
        expect(get).toBeCalledWith(
          "https://api.scryfall.com/cards/2dbccfc7-427b-41e6-b770-92d73994bf3b"
        );
        expect(get).toBeCalledWith(
          "https://api.scryfall.com/cards/2a452235-cebd-4e8f-b217-9b55fc1c3830"
        );
        expect(get).toBeCalledWith(
          "https://api.scryfall.com/cards/7bdb3368-fee3-4795-a23f-c97555ee7475"
        );

        tokens.forEach((token: Card) => {
          expect(token).toBeInstanceOf(Card);
          expect(token.layout).toBe("token");
        });
      });
    });

    it("resolves with empty array when rules text mentions tokens but no prints have them", function () {
      const list = wrapScryfallResponse(
        fixtures.listOfPrintsWithTokensButNoParts
      );
      const card = list[0];

      vi.spyOn(card, "getPrints").mockResolvedValue(list);

      return card.getTokens().then((tokens: Card[]) => {
        expect(card.getPrints).toBeCalledTimes(1);

        expect(get).toBeCalledTimes(0);
        expect(tokens).toEqual([]);
      });
    });
  });

  describe("getTaggerUrl", function () {
    it("returns the tagger url for the card", function () {
      const card = new Card(fixtures.card);

      const url = card.getTaggerUrl();

      expect(url).toBe("https://tagger.scryfall.com/card/ima/77");
    });
  });
});
