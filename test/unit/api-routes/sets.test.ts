import { getSets, getSet, getSetByTcgId } from "Api/sets";
import { get } from "Lib/api-request";

jest.mock("Lib/api-request");

describe("/sets", () => {
  let fakeGet: jest.SpyInstance;

  beforeEach(() => {
    fakeGet = jest.mocked(get);
  });

  afterEach(() => {
    fakeGet.mockClear();
  });

  describe("getSets", () => {
    it("requests the sets endpoint", () => {
      return getSets().then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/sets");
      });
    });
  });

  describe("getSet", () => {
    it("requests the sets/:code endpoint", () => {
      return getSet("foo").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/sets/foo");
      });
    });
  });

  describe("getSetByTcgId", () => {
    it("requests the sets/:code endpoint", () => {
      return getSetByTcgId(123).then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/sets/tcgplayer/123");
      });
    });
  });
});
