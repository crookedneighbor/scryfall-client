"use strict";

import Card from "Models/card";
import List from "Models/list";
import Set from "Models/set";
import GenericScryfallResponse from "Models/generic-scryfall-response";
import wrapScryfallResponse from "Lib/wrap-scryfall-response";
import fixtures from "Fixtures";
import type { ModelConfig } from "Types/model-config";

describe("Card", function () {
  let fakeRequestMethod: any, config: ModelConfig, card: Card;

  beforeEach(function () {
    fakeRequestMethod = jest.fn();
    config = {
      requestMethod: fakeRequestMethod,
    };
  });

  it("normalizes card faces", function () {
    const cardWithoutFaces = wrapScryfallResponse(fixtures.card, {
      requestMethod: fakeRequestMethod,
    });
    const cardWithFaces = wrapScryfallResponse(
      fixtures.cardWithTransformLayout,
      {
        requestMethod: fakeRequestMethod,
      }
    );

    expect(cardWithoutFaces.card_faces).not.toBe(fixtures.card.card_faces);
    expect(cardWithoutFaces.card_faces.length).toBe(1);
    expect(cardWithoutFaces.card_faces[0]).toEqual({
      object: "card_face",
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
  });

  describe("getRulings", function () {
    beforeEach(function () {
      fakeRequestMethod.mockResolvedValue(
        wrapScryfallResponse(fixtures.listOfRulings, {
          requestMethod: fakeRequestMethod,
        })
      );
      card = wrapScryfallResponse(fixtures.card, {
        requestMethod: fakeRequestMethod,
      });
    });

    it("gets rulings for card", function () {
      return card.getRulings().then((rulings: List) => {
        expect(typeof fixtures.card.rulings_uri).toBe("string");
        expect(fakeRequestMethod).toBeCalledWith(fixtures.card.rulings_uri);
        expect(rulings[0].comment).toBe(fixtures.listOfRulings.data[0].comment);
      });
    });
  });

  describe("getSet", function () {
    beforeEach(function () {
      fakeRequestMethod.mockResolvedValue(fixtures.set);
      card = wrapScryfallResponse(fixtures.card, {
        requestMethod: fakeRequestMethod,
      });
    });

    it("gets set for card", function () {
      return card.getSet().then((set: Set) => {
        expect(typeof fixtures.card.set_uri).toBe("string");
        expect(fakeRequestMethod).toBeCalledWith(fixtures.card.set_uri);
        expect(set.code).toBe(fixtures.set.code);
      });
    });
  });

  describe("getPrints", function () {
    beforeEach(function () {
      fakeRequestMethod.mockResolvedValue(
        wrapScryfallResponse(fixtures.listOfPrints, {
          requestMethod: fakeRequestMethod,
        })
      );
      card = wrapScryfallResponse(fixtures.card, {
        requestMethod: fakeRequestMethod,
      });
    });

    it("gets prints for card", function () {
      return card.getPrints().then((prints) => {
        expect(typeof fixtures.listOfPrints.data[0].name).toBe("string");
        expect(fakeRequestMethod).toBeCalledWith(
          fixtures.card.prints_search_uri
        );
        expect(prints[0].name).toBe(fixtures.listOfPrints.data[0].name);
        expect(prints.length).toBe(fixtures.listOfPrints.data.length);
      });
    });
  });

  describe("isLegal", function () {
    beforeEach(function () {
      card = wrapScryfallResponse(fixtures.card, {
        requestMethod: fakeRequestMethod,
      });
    });

    it("throws an error if no format is provided", function () {
      expect(() => {
        card.isLegal();
      }).toThrowError(
        "Must provide format for checking legality. Use one of `standard`, `future`, `frontier`, `modern`, `legacy`, `pauper`, `vintage`, `penny`, `commander`, `duel`, `oldschool`."
      );
    });

    it("throws an error if an unrecognized format is provided", function () {
      expect(() => {
        card.isLegal("foo");
      }).toThrowError(
        'Format "foo" is not recgonized. Use one of `standard`, `future`, `frontier`, `modern`, `legacy`, `pauper`, `vintage`, `penny`, `commander`, `duel`, `oldschool`.'
      );
    });

    it("returns true for legal card in provided format", function () {
      card.legalities!.commander = "legal";

      expect(card.isLegal("commander")).toBe(true);
    });

    it("returns true for restricted card in provided format", function () {
      card.legalities!.vintage = "restricted";

      expect(card.isLegal("vintage")).toBe(true);
    });

    it("returns false for illegal card in provided format", function () {
      card.legalities!.modern = "not_legal";

      expect(card.isLegal("modern")).toBe(false);
    });

    it("returns false for banned card in provided format", function () {
      card.legalities!.legacy = "banned";

      expect(card.isLegal("legacy")).toBe(false);
    });
  });

  describe("getImage", function () {
    it("returns with the specified image format for normal layout cards", function () {
      const card = wrapScryfallResponse(fixtures.card, {
        requestMethod: fakeRequestMethod,
      });

      let img = card.getImage("normal");
      expect(typeof img).toBe("string");
      expect(img).toBe(fixtures.card.image_uris.normal);

      img = card.getImage("small");
      expect(typeof img).toBe("string");
      expect(img).toBe(fixtures.card.image_uris.small);
    });

    it("defaults to normal layout", function () {
      const card = wrapScryfallResponse(fixtures.card, {
        requestMethod: fakeRequestMethod,
      });

      const img = card.getImage();
      expect(img).toBe(fixtures.card.image_uris.normal);
    });

    it("throws an error if image type does not exist", function () {
      const card = wrapScryfallResponse(fixtures.card, {
        requestMethod: fakeRequestMethod,
      });

      expect(() => {
        card.getImage("foo");
      }).toThrowError(
        "`foo` is not a valid type. Must be one of `small`, `normal`, `large`, `png`, `art_crop`, `border_crop`."
      );
    });

    it("uses default face for transform card", function () {
      const card = wrapScryfallResponse(fixtures.cardWithTransformLayout, {
        requestMethod: fakeRequestMethod,
      });

      const img = card.getImage();
      expect(typeof img).toBe("string");
      expect(img).toBe(
        fixtures.cardWithTransformLayout.card_faces[0].image_uris.normal
      );
    });

    it("gets image for flip card", function () {
      const card = wrapScryfallResponse(fixtures.cardWithFlipLayout, {
        requestMethod: fakeRequestMethod,
      });

      const img = card.getImage();
      expect(typeof img).toBe("string");
      expect(img).toBe(fixtures.cardWithFlipLayout.image_uris.normal);
    });

    it("gets image for meld card", function () {
      const card = wrapScryfallResponse(fixtures.cardWithMeldLayout, {
        requestMethod: fakeRequestMethod,
      });

      const img = card.getImage();
      expect(typeof img).toBe("string");
      expect(img).toBe(fixtures.cardWithMeldLayout.image_uris.normal);
    });

    it("rejects with an error if image uris cannot be found", function () {
      const card = wrapScryfallResponse(fixtures.cardWithTransformLayout, {
        requestMethod: fakeRequestMethod,
      });

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
      const card = wrapScryfallResponse(fixtures.card, {
        requestMethod: fakeRequestMethod,
      });

      const img = card.getBackImage();
      expect(img).toBe("https://img.scryfall.com/errors/missing.jpg");
    });

    it("returns with the same scryfall back image for normal layout cards regardless of type passed in", function () {
      const card = wrapScryfallResponse(fixtures.card, {
        requestMethod: fakeRequestMethod,
      });

      let img = card.getBackImage("normal");
      expect(img).toBe("https://img.scryfall.com/errors/missing.jpg");

      img = card.getBackImage("small");
      expect(img).toBe("https://img.scryfall.com/errors/missing.jpg");
    });

    it("rejects with an error if image type does not exist", function () {
      const card = wrapScryfallResponse(fixtures.cardWithTransformLayout, {
        requestMethod: fakeRequestMethod,
      });

      expect(() => {
        card.getBackImage("foo");
      }).toThrowError(
        "`foo` is not a valid type. Must be one of `small`, `normal`, `large`, `png`, `art_crop`, `border_crop`."
      );
    });

    it("rejects with an error if card does not have image uris", function () {
      const card = wrapScryfallResponse(fixtures.cardWithTransformLayout, {
        requestMethod: fakeRequestMethod,
      });
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
      const card = wrapScryfallResponse(fixtures.cardWithTransformLayout, {
        requestMethod: fakeRequestMethod,
      });

      const img = card.getBackImage();
      expect(img).toBe(
        fixtures.cardWithTransformLayout.card_faces[1].image_uris.normal
      );
    });

    it("can specify size for back face for transform card", function () {
      const card = wrapScryfallResponse(fixtures.cardWithTransformLayout, {
        requestMethod: fakeRequestMethod,
      });

      const img = card.getBackImage("small");
      expect(img).toBe(
        fixtures.cardWithTransformLayout.card_faces[1].image_uris.small
      );
    });

    it("gives the back card image for flip card", function () {
      const card = wrapScryfallResponse(fixtures.cardWithFlipLayout, {
        requestMethod: fakeRequestMethod,
      });

      const img = card.getBackImage();
      expect(img).toBe("https://img.scryfall.com/errors/missing.jpg");
    });
  });

  describe("getPrice", function () {
    let originalPrices: Record<string, string>;

    beforeEach(function () {
      card = wrapScryfallResponse(fixtures.card, {
        requestMethod: fakeRequestMethod,
      });
      originalPrices = Object.assign({}, fixtures.card.prices);

      Object.keys(originalPrices).forEach((priceKind) => {
        // ensure that each price type in fixture exists
        expect(Boolean(originalPrices[priceKind])).toBe(true);
      });
    });

    afterEach(function () {
      fixtures.card.prices! = originalPrices;
    });

    it("returns the non-foil usd price when no arguments are given", function () {
      expect(card.getPrice()).toBe(originalPrices.usd);
    });

    it("returns the specified version if given", function () {
      expect(card.getPrice("eur")).toBe(originalPrices.eur);
    });

    it("returns the foil price if no usd price is available and no argument is given", function () {
      delete card.prices!.usd;

      expect(card.getPrice()).toBe(originalPrices.usd_foil);
    });

    it("returns the eur price if no usd or foil price available", function () {
      delete card.prices!.usd;
      delete card.prices!.usd_foil;

      expect(card.getPrice()).toBe(originalPrices.eur);
    });

    it("returns the tix price if no usd or foil or eur price available", function () {
      delete card.prices!.usd;
      delete card.prices!.usd_foil;
      delete card.prices!.eur;

      expect(card.getPrice()).toBe(originalPrices.tix);
    });

    it("returns an empty string if no pricing is available", function () {
      delete card.prices!.usd;
      delete card.prices!.usd_foil;
      delete card.prices!.eur;
      delete card.prices!.tix;

      expect(card.getPrice()).toBe("");
    });

    it("returns an empty string if the specified type is not available", function () {
      delete card.prices!.usd_foil;

      expect(card.getPrice("usd_foil")).toBe("");
    });
  });

  describe("getTokens", function () {
    beforeEach(function () {
      fakeRequestMethod.mockResolvedValueOnce(
        wrapScryfallResponse(fixtures.tokens.elephant, {
          requestMethod: fakeRequestMethod,
        })
      );
      fakeRequestMethod.mockResolvedValueOnce(
        wrapScryfallResponse(fixtures.tokens.wolf, {
          requestMethod: fakeRequestMethod,
        })
      );
      fakeRequestMethod.mockResolvedValueOnce(
        wrapScryfallResponse(fixtures.tokens.snake, {
          requestMethod: fakeRequestMethod,
        })
      );
    });

    it("requests card objects for each token", function () {
      const card = wrapScryfallResponse(fixtures.cardWithMultipleTokens, {
        requestMethod: fakeRequestMethod,
      });

      return card.getTokens().then((tokens: Card[]) => {
        expect(fakeRequestMethod).toBeCalledTimes(3);
        expect(fakeRequestMethod).toBeCalledWith(
          "https://api.scryfall.com/cards/2dbccfc7-427b-41e6-b770-92d73994bf3b"
        );
        expect(fakeRequestMethod).toBeCalledWith(
          "https://api.scryfall.com/cards/2a452235-cebd-4e8f-b217-9b55fc1c3830"
        );
        expect(fakeRequestMethod).toBeCalledWith(
          "https://api.scryfall.com/cards/7bdb3368-fee3-4795-a23f-c97555ee7475"
        );

        tokens.forEach((token: Card) => {
          expect(token).toBeInstanceOf(Card);
          expect(token.layout).toBe("token");
        });
      });
    });

    it("resolves with an empty array when card has no `all_parts` attribute and no tokens in rules text", function () {
      const card = wrapScryfallResponse(fixtures.card, {
        requestMethod: fakeRequestMethod,
      });

      return card.getTokens().then((tokens: Card[]) => {
        expect(tokens).toEqual([]);
      });
    });

    it("looks up tokens from prints for card when card has no `all_parts` attribute, but rules text mentions token", function () {
      const card = wrapScryfallResponse(fixtures.cardWithTokenButNoParts, {
        requestMethod: fakeRequestMethod,
      });

      jest.spyOn(card, "getPrints").mockResolvedValue([
        wrapScryfallResponse(fixtures.cardWithTokenButNoParts, {
          requestMethod: fakeRequestMethod,
        }),
        wrapScryfallResponse(fixtures.cardWithMultipleTokens, {
          requestMethod: fakeRequestMethod,
        }),
      ]);

      return card.getTokens().then((tokens: Card[]) => {
        expect(card.getPrints).toBeCalledTimes(1);

        expect(fakeRequestMethod).toBeCalledTimes(3);
        expect(fakeRequestMethod).toBeCalledWith(
          "https://api.scryfall.com/cards/2dbccfc7-427b-41e6-b770-92d73994bf3b"
        );
        expect(fakeRequestMethod).toBeCalledWith(
          "https://api.scryfall.com/cards/2a452235-cebd-4e8f-b217-9b55fc1c3830"
        );
        expect(fakeRequestMethod).toBeCalledWith(
          "https://api.scryfall.com/cards/7bdb3368-fee3-4795-a23f-c97555ee7475"
        );

        tokens.forEach((token: Card) => {
          expect(token).toBeInstanceOf(Card);
          expect(token.layout).toBe("token");
        });
      });
    });

    it("resolves with empty array when rules text mentions tokens but no prints have them", function () {
      const card = wrapScryfallResponse(fixtures.cardWithTokenButNoParts, {
        requestMethod: fakeRequestMethod,
      });

      jest.spyOn(card, "getPrints").mockResolvedValue(
        wrapScryfallResponse(
          {
            object: "list",
            total_cards: 2,
            data: [fixtures.cardWithTokenButNoParts, fixtures.card],
          },
          {
            requestMethod: fakeRequestMethod,
          }
        )
      );

      return card.getTokens().then((tokens: Card[]) => {
        expect(card.getPrints).toBeCalledTimes(1);

        expect(fakeRequestMethod).toBeCalledTimes(0);
        expect(tokens).toEqual([]);
      });
    });
  });

  describe("getTaggerUrl", function () {
    it("returns the tagger url for the card", function () {
      const card = wrapScryfallResponse(fixtures.card, {
        requestMethod: fakeRequestMethod,
      });

      const url = card.getTaggerUrl();

      expect(url).toBe("https://tagger.scryfall.com/card/ima/77");
    });
  });
});
