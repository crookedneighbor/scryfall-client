"use strict";

import client = require("../../src/");
import fixtures from "Fixtures";
import Card from "Models/card";
import MagicSet from "Models/magic-set";
import Catalog from "Models/catalog";
import List from "Models/list";

import type { ListApiResponse } from "Types/api-response";
import CardApiResponse from "Types/api/card";

jest.setTimeout(90000);

const fakeCard: CardApiResponse = fixtures.card;
const fakeList: ListApiResponse = fixtures.listOfCards;

const budokaGardener = "49999b95-5e62-414c-b975-4191b9c1ab39";
const windfall = "357cf802-2d66-49a4-bf43-ab3bc30ab825";
const docentOfPerfection = "30c3d4c1-dc3d-4529-9d6e-8c16149cf6da";
const brunaFadingLight = "27907985-b5f6-4098-ab43-15a0c2bf94d5";
const brisela = "5a7a212e-e0b6-4f12-a95c-173cae023f93";
const beastialMenace = "73c16134-692d-4fd1-bffa-f9342113cbd8";
const originalProsh = "fc411c52-3ee2-4fe4-983d-3fa43b516237";

describe("scryfallClient", function () {
  describe("raw get/post", function () {
    it("can make a get request", function () {
      return client.get<Card>("cards/random").then((card) => {
        expect(card.object).toBe("card");
      });
    });

    it("handles errors", function () {
      return expect(client.get("foo")).rejects.toMatchObject({
        message: expect.any(String),
        status: 404,
      });
    });

    it("can send query params in get request", function () {
      return client
        .get<List<Card>>("cards/search", {
          q: "Budoka Gardener c:g",
        })
        .then((list) => {
          expect(list[0].object).toBe("card");
        });
    });

    it("can make a post request", function () {
      return client
        .post<List<Card>>("cards/collection", {
          identifiers: [
            {
              set: "c16",
              collector_number: "49",
            },
            {
              set: "zen",
              collector_number: "47",
            },
          ],
        })
        .then((cards) => {
          expect(cards[0].name).toBe("Vial Smasher the Fierce");
          expect(cards[1].name).toBe("Hedron Crab");
        });
    });
  });

  describe("List object", function () {
    it("can get the next page of results", function () {
      return client
        .search("set:rix")
        .then((list) => {
          expect(list.object).toBe("list");

          return list.next();
        })
        .then((list) => {
          expect(list.object).toBe("list");
        });
    });

    it("can recursively call next", function () {
      let totalCards: number;

      function collectCards(
        list: List<Card>,
        allCards: Card[] = []
      ): Promise<List<Card> | Card[]> {
        allCards.push(...list);

        if (!list.has_more) {
          return Promise.resolve(allCards);
        }

        return list.next().then(function (newList) {
          return collectCards(newList, allCards);
        });
      }

      return client
        .search("format:standard r:r")
        .then(function (list) {
          // TODO should have a CardList object that
          // has total_cards so we don't have to force it with non-null assertion
          totalCards = list.total_cards!;

          return collectCards(list);
        })
        .then(function (allRareCardsInStandard) {
          expect(allRareCardsInStandard.length).toBe(totalCards);
        });
    });
  });

  describe("Set object", function () {
    it("can get cards from set", function () {
      return client
        .getSet("dom")
        .then((set) => {
          return set.getCards();
        })
        .then((list) => {
          expect(list).toBeInstanceOf(List);
          expect(list.object).toBe("list");
          expect(list[0]).toBeInstanceOf(Card);
          expect(list[0].object).toBe("card");
        });
    });
  });

  describe("Card object", function () {
    it("can get rulings for card", function () {
      return client
        .getCardByScryfallId(budokaGardener)
        .then((card) => {
          return card.getRulings();
        })
        .then((rulings) => {
          expect(rulings.object).toBe("list");
          expect(rulings[0].object).toBe("ruling");
        });
    });

    it("can get set object for card", function () {
      return client
        .getCardByScryfallId(budokaGardener)
        .then((card) => {
          return card.getSet();
        })
        .then((set) => {
          expect(set.object).toBe("set");
        });
    });

    it("can get prints for card", function () {
      return client
        .getCardByScryfallId(windfall)
        .then((card) => {
          return card.getPrints();
        })
        .then((prints) => {
          expect(prints.object).toBe("list");
          expect(prints.length).toBeGreaterThan(1);
        });
    });

    it("can check legality of a card", function () {
      return client.search("format:standard r:r").then((list) => {
        const card = list[0];

        expect(card.isLegal("standard")).toBe(true);
        expect(card.isLegal("pauper")).toBe(false);
      });
    });

    describe("card images", function () {
      it("can get the image of a card", function () {
        let id: string;

        return client.getCardByScryfallId(windfall).then((card) => {
          id = card.id;

          const image = card.getImage();
          expect(typeof image).toBe("string");
          expect(image).toEqual(expect.stringContaining("img.scryfall.com"));
          expect(image).toEqual(expect.stringContaining(id));
        });
      });

      it("can get the image of a transform card", function () {
        let id: string;

        return client.getCardByScryfallId(docentOfPerfection).then((card) => {
          id = card.id;

          const image = card.getImage();
          expect(typeof image).toBe("string");
          expect(image).toEqual(expect.stringContaining("img.scryfall.com"));
          expect(image).toEqual(expect.stringContaining(id));
        });
      });

      it("can get the image of a meld card", function () {
        let id: string;

        return client.getCardByScryfallId(brunaFadingLight).then((card) => {
          id = card.id;

          const image = card.getImage();
          expect(typeof image).toBe("string");
          expect(image).toEqual(expect.stringContaining("img.scryfall.com"));
          expect(image).toEqual(expect.stringContaining(id));
        });
      });

      it("can get the image of a melded card", function () {
        let id: string;

        return client.getCardByScryfallId(brisela).then((card) => {
          id = card.id;

          const image = card.getImage();
          expect(typeof image).toBe("string");
          expect(image).toEqual(expect.stringContaining("img.scryfall.com"));
          expect(image).toEqual(expect.stringContaining(id));
        });
      });

      it("can get the backside image of a normal card (missing url)", function () {
        return client.getCardByScryfallId(windfall).then((card) => {
          const image = card.getBackImage();
          expect(image).toBe("https://img.scryfall.com/errors/missing.jpg");
        });
      });

      it("can get the backside image of a meld card (missing url)", function () {
        return client.getCardByScryfallId(brunaFadingLight).then((card) => {
          const image = card.getBackImage();
          expect(image).toBe("https://img.scryfall.com/errors/missing.jpg");
        });
      });

      it("can get the backside image of a transform card", function () {
        let id: string;

        return client.getCardByScryfallId(docentOfPerfection).then((card) => {
          id = card.id;

          const image = card.getBackImage();
          expect(image).toEqual(expect.stringContaining("img.scryfall.com"));
          expect(image).toEqual(expect.stringContaining(id));
        });
      });
    });

    it("can get price for a card", function () {
      return client.getCardByScryfallId(beastialMenace).then((card) => {
        const price = Number(card.getPrice());

        expect(price).toBeGreaterThan(0);
      });
    });

    it("can get tokens for a card", function () {
      return client
        .getCardByScryfallId(beastialMenace)
        .then((card) => {
          return card.getTokens();
        })
        .then((tokens) => {
          expect(tokens.length).toBe(3);

          // TODO remove this when request is no longer sending an any result
          tokens.forEach((token: Card) => {
            expect(token.layout).toBe("token");
          });
        });
    });

    it("can get tokens for a card where the print does not have tokens", function () {
      return client
        .getCardByScryfallId(originalProsh)
        .then((card) => {
          return card.getTokens();
        })
        .then((tokens) => {
          expect(tokens.length).toBe(1);
          expect(tokens[0].layout).toBe("token");
        });
    });
  });

  describe("getSet", () => {
    it("gets a set", () => {
      return client.getSet("dom").then((set) => {
        expect(set).toBeInstanceOf(MagicSet);
        expect(set.code).toBe("dom");
        expect(set.name).toBe("Dominaria");
      });
    });
  });

  describe("search", () => {
    it("gets a list of scryfall cards", () => {
      return client.search("is:commander ids=wu").then((result) => {
        expect(result).toBeInstanceOf(List);
        expect(result.total_cards).toBeGreaterThan(0);
        expect(result[0]).toBeInstanceOf(Card);
      });
    });

    it("can pass additional query params", () => {
      return client
        .search("Rashmi, Eternities Crafter")
        .then((result) => {
          expect(result.length).toBe(1);
          return client.search("Rashmi, Eternities Crafter", {
            unique: "prints",
          });
        })
        .then((result) => {
          expect(result.length).toBeGreaterThan(1);
        });
    });
  });

  describe("autocomplete", () => {
    it("can use the autocomplete endpoint", () => {
      return client.autocomplete("Thalia").then((result) => {
        expect(result).toBeInstanceOf(Catalog);
        expect(result.length).toBeGreaterThan(3);
        result.forEach((entry) => {
          expect(entry).toBeTruthy();
        });
      });
    });

    it("can include extras", () => {
      return client
        .autocomplete("World Champion")
        .then((result) => {
          expect(result.length).toBe(0);

          return client.autocomplete("World Champion", {
            include_extras: true,
          });
        })
        .then((result) => {
          expect(result.length).toBeGreaterThan(3);
        });
    });
  });

  describe("getCollection", () => {
    it("can find collection", () => {
      return client
        .getCollection([
          {
            id: "683a5707-cddb-494d-9b41-51b4584ded69",
          },
          {
            mtgo_id: 54957,
          },
          {
            multiverse_id: 409574,
          },
          {
            oracle_id: "a3fb7228-e76b-4e96-a40e-20b5fed75685",
          },
          {
            illustration_id: "4782559a-f001-4ce6-8672-afd07935440d",
          },
          {
            name: "Ancient Tomb",
          },
          {
            name: "Austere Command",
            set: "lrw",
          },
          {
            set: "mrd",
            collector_number: "150",
          },
        ])
        .then((list) => {
          expect(list).toBeInstanceOf(List);
          expect(list[0].id).toBe("683a5707-cddb-494d-9b41-51b4584ded69");
          expect(list[1].mtgo_id).toBe(54957);
          expect(list[2].multiverse_ids).toContain(409574);
          expect(list[3].oracle_id).toBe(
            "a3fb7228-e76b-4e96-a40e-20b5fed75685"
          );
          expect(list[4].illustration_id).toBe(
            "4782559a-f001-4ce6-8672-afd07935440d"
          );
          expect(list[5].name).toBe("Ancient Tomb");
          expect(list[6].name).toBe("Austere Command");
          expect(list[6].set).toBe("lrw");
          expect(list[7].set).toBe("mrd");
          expect(list[7].collector_number).toBe("150");
        });
    });
  });

  describe("getCardByScryfallId", () => {
    it("gets a card by scryfall id", () => {
      return client.getCardByScryfallId(windfall).then((card) => {
        expect(card).toBeInstanceOf(Card);
        expect(card.name).toBe("Windfall");
      });
    });
  });

  describe("getCatalog", () => {
    it("gets a specified catalog", () => {
      return client.getCatalog("artist-names").then((catalog) => {
        expect(catalog).toBeInstanceOf(Catalog);
        expect(catalog.find((e) => e === "Magali Villeneuve")).toBeTruthy();
      });
    });
  });

  describe("getSymbolUrl", function () {
    it("returns the url for a character representing a symbol", function () {
      expect(client.getSymbolUrl("W")).toBe(
        "https://img.scryfall.com/symbology/W.svg"
      );
    });

    it("returns the url for symbol in curly braces", function () {
      expect(client.getSymbolUrl("{U}")).toBe(
        "https://img.scryfall.com/symbology/U.svg"
      );
    });
  });

  describe("wrap", function () {
    it("can wrap saved response object into scryfall response", function () {
      const card = client.wrap(fakeCard);

      expect(card).toBeInstanceOf(Card);
      expect(card.name).toBe("Windfall");
    });

    it("can wrap saved list response object into scryfall response", function () {
      const list = client.wrap(fakeList);

      expect(list).toBeInstanceOf(List);
      expect(list[0].name).toBe("Abbey Griffin");
      expect(list[0]).toBeInstanceOf(Card);
    });
  });

  describe("text transformations", function () {
    afterEach(() => {
      client.resetTextTransform();
    });

    it("can set custom text transform function", function () {
      client.setTextTransform((text) => {
        return text.toUpperCase();
      });

      return client.getCardByScryfallId(windfall).then((card) => {
        expect(card.name).toBe("WINDFALL");
      });
    });

    it("can set text transform to slack emoji", function () {
      client.slackify();

      return client.getCardByScryfallId(originalProsh).then((card) => {
        expect(card.mana_cost).toBe(":mana-3::mana-B::mana-R::mana-G:");
      });
    });

    it("can set text transform to discord emoji", function () {
      client.discordify();

      return client.getCardByScryfallId(originalProsh).then((card) => {
        expect(card.mana_cost).toBe(":mana3::manaB::manaR::manaG:");
      });
    });
  });
});
