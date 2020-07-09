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

import { mocked } from "ts-jest/utils";

jest.mock("Lib/api-request");

describe("/cards", () => {
  let fakeGet: jest.SpyInstance;
  let fakePost: jest.SpyInstance;

  beforeEach(() => {
    fakeGet = mocked(get);
    fakePost = mocked(post);
  });

  afterEach(() => {
    fakeGet.mockClear();
    fakePost.mockClear();
  });

  describe("search", () => {
    it("requests the search endpoint", () => {
      return search("foo").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/search", {
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
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/search", {
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
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/autocomplete", {
          q: "foo",
        });
      });
    });

    it("allows passing include_extras", () => {
      return autocomplete("foo", { include_extras: true }).then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/autocomplete", {
          q: "foo",
          include_extras: true,
        });
      });
    });
  });

  describe("getCollection", () => {
    it("requests the collection endpoint", () => {
      return getCollection([{ id: "foo" }]).then(() => {
        expect(fakePost).toBeCalledTimes(1);
        expect(fakePost).toBeCalledWith("/cards/collection", {
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
        expect(fakePost).toBeCalledTimes(1);
        expect(fakePost).toBeCalledWith("/cards/collection", {
          identifiers,
        });
      });
    });

    it("batches requests when identifiers extends past 75 entries", () => {
      const fakeEntry = {
        set: "foo",
        collector_number: "1",
      };
      const entries = [];
      let i = 0;
      while (i < 400) {
        entries.push(fakeEntry);
        i++;
      }

      return getCollection(entries).then(() => {
        expect(fakePost).toBeCalledTimes(6);
        expect(fakePost.mock.calls[0][1].identifiers.length).toBe(75);
        expect(fakePost.mock.calls[1][1].identifiers.length).toBe(75);
        expect(fakePost.mock.calls[2][1].identifiers.length).toBe(75);
        expect(fakePost.mock.calls[3][1].identifiers.length).toBe(75);
        expect(fakePost.mock.calls[4][1].identifiers.length).toBe(75);
        expect(fakePost.mock.calls[5][1].identifiers.length).toBe(25);
      });
    });
  });

  describe("getCard", () => {
    it("requests the card id endpoint", () => {
      return getCard("foo").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/foo");
      });
    });

    it("requests the card id endpoint with `id` param", () => {
      return getCard("foo", "id").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/foo");
      });
    });

    it("requests the card id endpoint with `scryfall` param", () => {
      return getCard("foo", "scryfall").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/foo");
      });
    });

    it("requests the card multiverse endpoint with `multiverse` param", () => {
      return getCard("foo", "multiverse").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/multiverse/foo");
      });
    });

    it("requests the card arena id endpoint with `arena` param", () => {
      return getCard("foo", "arena").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/arena/foo");
      });
    });

    it("requests the card mtgo id endpoint with `mtgo` param", () => {
      return getCard("foo", "mtgo").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/mtgo/foo");
      });
    });

    it("requests the card TCG Player id endpoint with `tcg` param", () => {
      return getCard("foo", "tcg").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/tcgplayer/foo");
      });
    });

    it("requests the card name endpoint with `name` param", () => {
      return getCard("foo", "name").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/named", {
          fuzzy: "foo",
        });
      });
    });

    it("requests the card name endpoint with `fuzzyName` param", () => {
      return getCard("foo", "fuzzyName").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/named", {
          fuzzy: "foo",
        });
      });
    });

    it("requests the card name endpoint with `exactName` param", () => {
      return getCard("foo", "exactName").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/named", {
          exact: "foo",
        });
      });
    });
  });

  describe("getCardNamed", () => {
    it("gets fuzzy name", () => {
      return getCardNamed("foo").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/named", {
          fuzzy: "foo",
        });
      });
    });

    it("gets fuzzy name with kind parameter", () => {
      return getCardNamed("foo", { kind: "fuzzy" }).then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/named", {
          fuzzy: "foo",
        });
      });
    });

    it("gets exact name with kind parameter", () => {
      return getCardNamed("foo", { kind: "exact" }).then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/named", {
          exact: "foo",
        });
      });
    });

    it("can specify set", () => {
      return getCardNamed("foo", { set: "aer" }).then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/named", {
          fuzzy: "foo",
          set: "aer",
        });
      });
    });
  });

  describe("getCardBySetCodeAndCollectorNumber", () => {
    it("calls set and number endpoint", () => {
      return getCardBySetCodeAndCollectorNumber("foo", "123a").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/foo/123a");
      });
    });

    it("calls set and number endpoint with lang", () => {
      return getCardBySetCodeAndCollectorNumber("foo", "123a", "es").then(
        () => {
          expect(fakeGet).toBeCalledTimes(1);
          expect(fakeGet).toBeCalledWith("/cards/foo/123a/es");
        }
      );
    });
  });

  describe("random", () => {
    it("calls random endpoint", () => {
      return random().then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/random");
      });
    });

    it("calls random endpoint with search query", () => {
      return random("foo").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/random", {
          q: "foo",
        });
      });
    });
  });
});
