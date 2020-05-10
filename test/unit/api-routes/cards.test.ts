import { search, getCollection, getCardByScryfallId } from "Api/cards";
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
  });

  describe("getCardByScryfallId", () => {
    it("requests the card id endpoint", () => {
      return getCardByScryfallId("foo").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/cards/foo");
      });
    });
  });
});
