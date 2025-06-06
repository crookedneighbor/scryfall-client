import Card from "../../../src/models/card";
import List from "../../../src/models/list";
import MagicSet from "../../../src/models/magic-set";
import GenericScryfallResponse from "../../../src/models/generic-scryfall-response";
import { get } from "../../../src/lib/api-request";
import wrapScryfallResponse from "../../../src/lib/wrap-scryfall-response";
import {
  cardFixture,
  cardWithFlavorNameOnMultipleFacesFixture,
  cardWithFlipLayoutFixture,
  cardWithMeldLayoutFixture,
  cardWithMultipleTokensFixture,
  cardWithTokenButNoPartsFixture,
  cardWithTransformLayoutFixture,
  listOfPrintsFixture,
  listOfPrintsWithAndWithoutTokensFixture,
  listOfPrintsWithTokensButNoPartsFixture,
  listOfRulingsFixture,
  setFixture,
  tokensFixture,
} from "../../fixtures";

vi.mock("../../../src/lib/api-request");

describe("Card", function () {
  let fakeRequest, card: Card;

  beforeEach(() => {
    fakeRequest = vi.mocked(get);
  });

  it("normalizes card faces", function () {
    const cardWithoutFaces = new Card(cardFixture);
    const cardWithFaces = new Card(cardWithTransformLayoutFixture);
    const cardWithFlavorNameOnMultipleFaces = new Card(
      cardWithFlavorNameOnMultipleFacesFixture,
    );

    expect(cardWithoutFaces.card_faces).not.toBe(cardFixture.card_faces);
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
      cardWithTransformLayoutFixture.card_faces,
    );

    expect(cardWithFlavorNameOnMultipleFaces.flavor_name).toBe(
      cardWithFlavorNameOnMultipleFacesFixture.card_faces[0].flavor_name +
        " // " +
        cardWithFlavorNameOnMultipleFaces.card_faces[1].flavor_name,
    );
  });

  describe("getRulings", function () {
    beforeEach(function () {
      fakeRequest.mockResolvedValue(wrapScryfallResponse(listOfRulingsFixture));
      card = new Card(cardFixture);
    });

    it("gets rulings for card", function () {
      return card
        .getRulings()
        .then((rulings: List<GenericScryfallResponse>) => {
          expect(typeof cardFixture.rulings_uri).toBe("string");
          expect(get).toBeCalledTimes(1);
          expect(get).toBeCalledWith(cardFixture.rulings_uri);
          expect(rulings[0].comment).toBe(listOfRulingsFixture.data[0].comment);
        });
    });
  });

  describe("getSet", function () {
    beforeEach(function () {
      fakeRequest.mockResolvedValue(setFixture);
      card = new Card(cardFixture);
    });

    it("gets set for card", function () {
      return card.getSet().then((set: MagicSet) => {
        expect(typeof cardFixture.set_uri).toBe("string");
        expect(get).toBeCalledWith(cardFixture.set_uri);
        expect(set.code).toBe(setFixture.code);
      });
    });
  });

  describe("getPrints", function () {
    beforeEach(function () {
      fakeRequest.mockResolvedValue(wrapScryfallResponse(listOfPrintsFixture));
      card = new Card(cardFixture);
    });

    it("gets prints for card", function () {
      return card.getPrints().then((prints) => {
        expect(typeof listOfPrintsFixture.data[0].name).toBe("string");
        expect(get).toBeCalledWith(cardFixture.prints_search_uri);
        expect(prints[0].name).toBe(listOfPrintsFixture.data[0].name);
        expect(prints.length).toBe(listOfPrintsFixture.data.length);
      });
    });
  });

  describe("isLegal", function () {
    beforeEach(function () {
      card = new Card(cardFixture);
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
      const card = new Card(cardFixture);

      let img = card.getImage("normal");
      expect(typeof img).toBe("string");
      expect(img).toBe(cardFixture.image_uris.normal);

      img = card.getImage("small");
      expect(typeof img).toBe("string");
      expect(img).toBe(cardFixture.image_uris.small);
    });

    it("defaults to normal layout", function () {
      const card = new Card(cardFixture);

      const img = card.getImage();
      expect(img).toBe(cardFixture.image_uris.normal);
    });

    it("uses default face for transform card", function () {
      const card = new Card(cardWithTransformLayoutFixture);

      const img = card.getImage();
      expect(typeof img).toBe("string");
      expect(img).toBe(
        cardWithTransformLayoutFixture.card_faces[0].image_uris.normal,
      );
    });

    it("gets image for flip card", function () {
      const card = new Card(cardWithFlipLayoutFixture);

      const img = card.getImage();
      expect(typeof img).toBe("string");
      expect(img).toBe(cardWithFlipLayoutFixture.image_uris.normal);
    });

    it("gets image for meld card", function () {
      const card = new Card(cardWithMeldLayoutFixture);

      const img = card.getImage();
      expect(typeof img).toBe("string");
      expect(img).toBe(cardWithMeldLayoutFixture.image_uris.normal);
    });

    it("rejects with an error if image uris cannot be found", function () {
      const card = new Card(cardWithTransformLayoutFixture);

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
      const card = new Card(cardFixture);

      const img = card.getBackImage();
      expect(img).toBe("http://cards.scryfall.io/back.png");
    });

    it("returns with the same scryfall back image for normal layout cards regardless of type passed in", function () {
      const card = new Card(cardFixture);

      let img = card.getBackImage("normal");
      expect(img).toBe("http://cards.scryfall.io/back.png");

      img = card.getBackImage("small");
      expect(img).toBe("http://cards.scryfall.io/back.png");
    });

    it("rejects with an error if card does not have image uris", function () {
      const card = new Card(cardWithTransformLayoutFixture);
      const oldImageUris = card.card_faces[1].image_uris;

      delete card.card_faces[1].image_uris;

      expect(() => {
        card.getBackImage();
      }).toThrowError(
        "An unexpected error occured when attempting to show back side of card.",
      );

      card.card_faces[1].image_uris = oldImageUris;
    });

    it("uses back face for transform card", function () {
      const card = new Card(cardWithTransformLayoutFixture);

      const img = card.getBackImage();
      expect(img).toBe(
        cardWithTransformLayoutFixture.card_faces[1].image_uris.normal,
      );
    });

    it("can specify size for back face for transform card", function () {
      const card = new Card(cardWithTransformLayoutFixture);

      const img = card.getBackImage("small");
      expect(img).toBe(
        cardWithTransformLayoutFixture.card_faces[1].image_uris.small,
      );
    });

    it("gives the back card image for flip card", function () {
      const card = new Card(cardWithFlipLayoutFixture);

      const img = card.getBackImage();
      expect(img).toBe("http://cards.scryfall.io/back.png");
    });
  });

  describe("getPrice", function () {
    let originalPrices: Record<string, string>;

    beforeEach(function () {
      card = new Card(cardFixture);
      originalPrices = Object.assign({}, cardFixture.prices);

      Object.keys(originalPrices).forEach((priceKind) => {
        // ensure that each price type in fixture exists
        expect(Boolean(originalPrices[priceKind])).toBe(true);
      });
    });

    afterEach(function () {
      cardFixture.prices = originalPrices;
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
        wrapScryfallResponse(tokensFixture.elephant),
      );
      fakeRequest.mockResolvedValueOnce(
        wrapScryfallResponse(tokensFixture.wolf),
      );
      fakeRequest.mockResolvedValueOnce(
        wrapScryfallResponse(tokensFixture.snake),
      );
    });

    it("requests card objects for each token", function () {
      const card = new Card(cardWithMultipleTokensFixture);

      return card.getTokens().then((tokens: Card[]) => {
        expect(get).toBeCalledTimes(3);
        expect(get).toBeCalledWith(
          "https://api.scryfall.com/cards/2dbccfc7-427b-41e6-b770-92d73994bf3b",
        );
        expect(get).toBeCalledWith(
          "https://api.scryfall.com/cards/2a452235-cebd-4e8f-b217-9b55fc1c3830",
        );
        expect(get).toBeCalledWith(
          "https://api.scryfall.com/cards/7bdb3368-fee3-4795-a23f-c97555ee7475",
        );

        tokens.forEach((token: Card) => {
          expect(token).toBeInstanceOf(Card);
          expect(token.layout).toBe("token");
        });
      });
    });

    it("resolves with an empty array when card has no `all_parts` attribute and no tokens in rules text", function () {
      const card = new Card(cardFixture);

      return card.getTokens().then((tokens: Card[]) => {
        expect(tokens).toEqual([]);
      });
    });

    it("looks up tokens from prints for card when card has no `all_parts` attribute, but rules text mentions token", function () {
      const list = wrapScryfallResponse(
        listOfPrintsWithAndWithoutTokensFixture,
      ) as List<Card>;
      const card = list.find((c) => !c.all_parts);

      vi.spyOn(card, "getPrints").mockResolvedValue(
        wrapScryfallResponse({
          object: "list",
          data: [cardWithTokenButNoPartsFixture, cardWithMultipleTokensFixture],
        }),
      );

      return card.getTokens().then((tokens: Card[]) => {
        expect(card.getPrints).toBeCalledTimes(1);

        expect(get).toBeCalledTimes(3);
        expect(get).toBeCalledWith(
          "https://api.scryfall.com/cards/2dbccfc7-427b-41e6-b770-92d73994bf3b",
        );
        expect(get).toBeCalledWith(
          "https://api.scryfall.com/cards/2a452235-cebd-4e8f-b217-9b55fc1c3830",
        );
        expect(get).toBeCalledWith(
          "https://api.scryfall.com/cards/7bdb3368-fee3-4795-a23f-c97555ee7475",
        );

        tokens.forEach((token: Card) => {
          expect(token).toBeInstanceOf(Card);
          expect(token.layout).toBe("token");
        });
      });
    });

    it("resolves with empty array when rules text mentions tokens but no prints have them", function () {
      const list = wrapScryfallResponse(
        listOfPrintsWithTokensButNoPartsFixture,
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
      const card = new Card(cardFixture);

      const url = card.getTaggerUrl();

      expect(url).toBe("https://tagger.scryfall.com/card/ima/77");
    });
  });
});
