import {
  autocomplete,
  search,
  getCollection,
  getCard,
  getCardNamed,
  getCardBySetCodeAndCollectorNumber,
  random,
} from "Api/cards";
import { get, post } from "Lib/api-request";
import { listOfCardsFixture } from "Fixtures";
import List from "Models/list";

vi.mock("Lib/api-request");

describe("/cards", () => {
  beforeEach(() => {
    get.mockResolvedValue({});
    post.mockResolvedValue({
      warnings: [],
      not_found: [],
    });
  });

  describe("search", () => {
    it("requests the search endpoint", () => {
      return search("foo").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/search", {
          q: "foo",
        });
      });
    });

    it("can pass additional query params", () => {
      return search("foo", {
        unique: "prints",
        order: "usd",
        dir: "desc",
        include_extras: true,
        include_multilingual: true,
        include_variations: false,
        page: 123,
      }).then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/search", {
          q: "foo",
          unique: "prints",
          order: "usd",
          dir: "desc",
          include_extras: true,
          include_multilingual: true,
          include_variations: false,
          page: 123,
        });
      });
    });
  });

  describe("autocomplete", () => {
    it("requests the autocomplete endpoint", () => {
      return autocomplete("foo").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/autocomplete", {
          q: "foo",
        });
      });
    });

    it("allows passing include_extras", () => {
      return autocomplete("foo", { include_extras: true }).then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/autocomplete", {
          q: "foo",
          include_extras: true,
        });
      });
    });
  });

  describe("getCollection", () => {
    it("requests the collection endpoint", () => {
      return getCollection([{ id: "foo" }]).then(() => {
        expect(post).toBeCalledTimes(1);
        expect(post).toBeCalledWith("/cards/collection", {
          identifiers: [{ id: "foo" }],
        });
      });
    });

    it("supports all kinds of Scryfall identifier objects", () => {
      const identifiers = [
        {
          id: "id",
        },
        {
          mtgo_id: 1234,
        },
        {
          multiverse_id: 5678,
        },
        {
          oracle_id: "oracle-id",
        },
        {
          illustration_id: "illustation-id",
        },
        {
          name: "name",
        },
        {
          name: "name",
          set: "set",
        },
        {
          collector_number: "collector-number",
          set: "set",
        },
      ];
      return getCollection(identifiers).then(() => {
        expect(post).toBeCalledTimes(1);
        expect(post).toBeCalledWith("/cards/collection", {
          identifiers,
        });
      });
    });

    it("batches requests when identifiers extends past 75 entries", () => {
      const fakeEntry = {
        set: "foo",
        collector_number: "1",
      };
      const entries: (typeof fakeEntry)[] = [];
      let i = 0;
      while (i < 400) {
        entries.push(fakeEntry);
        i++;
      }

      return getCollection(entries).then(() => {
        expect(post).toBeCalledTimes(6);

        expect(post.mock.calls[0][1].identifiers.length).toBe(75);
        expect(post.mock.calls[1][1].identifiers.length).toBe(75);
        expect(post.mock.calls[2][1].identifiers.length).toBe(75);
        expect(post.mock.calls[3][1].identifiers.length).toBe(75);
        expect(post.mock.calls[4][1].identifiers.length).toBe(75);
        expect(post.mock.calls[5][1].identifiers.length).toBe(25);
      });
    });

    it("includes all not_found items in final array", () => {
      const fakeEntry = {
        set: "foo",
        collector_number: "1",
      };
      const entries: (typeof fakeEntry)[] = [];
      let i = 0;
      while (i < 400) {
        entries.push(fakeEntry);
        i++;
      }

      const notFound1 = JSON.parse(JSON.stringify(listOfCardsFixture));
      const notFound2 = JSON.parse(JSON.stringify(listOfCardsFixture));

      notFound1.not_found = [{ name: "foo" }];
      notFound2.not_found = [{ name: "bar" }, { name: "baz" }];

      post.mockResolvedValueOnce(new List(listOfCardsFixture));
      post.mockResolvedValueOnce(new List(notFound1));
      post.mockResolvedValueOnce(new List(listOfCardsFixture));
      post.mockResolvedValueOnce(new List(notFound2));
      post.mockResolvedValueOnce(new List(listOfCardsFixture));

      return getCollection(entries).then((result) => {
        expect(result.not_found.length).toBe(3);
        expect(result.not_found[0]).toEqual({ name: "foo" });
        expect(result.not_found[1]).toEqual({ name: "bar" });
        expect(result.not_found[2]).toEqual({ name: "baz" });
      });
    });

    it("includes all warning items in final array", () => {
      const fakeEntry = {
        set: "foo",
        collector_number: "1",
      };
      const entries: (typeof fakeEntry)[] = [];
      let i = 0;
      while (i < 400) {
        entries.push(fakeEntry);
        i++;
      }

      const warnings1 = JSON.parse(JSON.stringify(listOfCardsFixture));
      const warnings2 = JSON.parse(JSON.stringify(listOfCardsFixture));

      warnings1.warnings = ["foo"];
      warnings2.warnings = ["bar", "baz"];

      post.mockResolvedValueOnce(new List(listOfCardsFixture));
      post.mockResolvedValueOnce(new List(warnings1));
      post.mockResolvedValueOnce(new List(listOfCardsFixture));
      post.mockResolvedValueOnce(new List(warnings2));
      post.mockResolvedValueOnce(new List(listOfCardsFixture));

      return getCollection(entries).then((result) => {
        expect(result.warnings.length).toBe(3);
        expect(result.warnings[0]).toEqual("foo");
        expect(result.warnings[1]).toEqual("bar");
        expect(result.warnings[2]).toEqual("baz");
      });
    });
  });

  describe("getCard", () => {
    it("requests the card id endpoint", () => {
      return getCard("foo").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/foo");
      });
    });

    it("requests the card id endpoint with `id` param", () => {
      return getCard("foo", "id").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/foo");
      });
    });

    it("requests the card id endpoint with `scryfall` param", () => {
      return getCard("foo", "scryfall").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/foo");
      });
    });

    it("requests the card multiverse endpoint with `multiverse` param", () => {
      return getCard("foo", "multiverse").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/multiverse/foo");
      });
    });

    it("requests the card arena id endpoint with `arena` param", () => {
      return getCard("foo", "arena").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/arena/foo");
      });
    });

    it("requests the card mtgo id endpoint with `mtgo` param", () => {
      return getCard("foo", "mtgo").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/mtgo/foo");
      });
    });

    it("requests the card TCG Player id endpoint with `tcg` param", () => {
      return getCard("foo", "tcg").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/tcgplayer/foo");
      });
    });

    it("requests the card name endpoint with `name` param", () => {
      return getCard("foo", "name").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/named", {
          fuzzy: "foo",
        });
      });
    });

    it("requests the card name endpoint with `fuzzyName` param", () => {
      return getCard("foo", "fuzzyName").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/named", {
          fuzzy: "foo",
        });
      });
    });

    it("requests the card name endpoint with `exactName` param", () => {
      return getCard("foo", "exactName").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/named", {
          exact: "foo",
        });
      });
    });
  });

  describe("getCardNamed", () => {
    it("gets fuzzy name", () => {
      return getCardNamed("foo").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/named", {
          fuzzy: "foo",
        });
      });
    });

    it("gets fuzzy name with kind parameter", () => {
      return getCardNamed("foo", { kind: "fuzzy" }).then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/named", {
          fuzzy: "foo",
        });
      });
    });

    it("gets exact name with kind parameter", () => {
      return getCardNamed("foo", { kind: "exact" }).then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/named", {
          exact: "foo",
        });
      });
    });

    it("can specify set", () => {
      return getCardNamed("foo", { set: "aer" }).then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/named", {
          fuzzy: "foo",
          set: "aer",
        });
      });
    });
  });

  describe("getCardBySetCodeAndCollectorNumber", () => {
    it("calls set and number endpoint", () => {
      return getCardBySetCodeAndCollectorNumber("foo", "123a").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/foo/123a");
      });
    });

    it("calls set and number endpoint with lang", () => {
      return getCardBySetCodeAndCollectorNumber("foo", "123a", "es").then(
        () => {
          expect(get).toBeCalledTimes(1);
          expect(get).toBeCalledWith("/cards/foo/123a/es");
        },
      );
    });
  });

  describe("random", () => {
    it("calls random endpoint", () => {
      return random().then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/random");
      });
    });

    it("calls random endpoint with search query", () => {
      return random("foo").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/cards/random", {
          q: "foo",
        });
      });
    });
  });
});
