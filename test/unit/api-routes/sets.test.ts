import { getSets, getSet, getSetByTcgId } from "../../../src/api-routes/sets";
import { get } from "../../../src/lib/api-request";

vi.mock("../../../src/lib/api-request");

describe("/sets", () => {
  beforeEach(() => {
    get.mockResolvedValue({});
  });

  describe("getSets", () => {
    it("requests the sets endpoint", () => {
      return getSets().then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/sets");
      });
    });
  });

  describe("getSet", () => {
    it("requests the sets/:code endpoint", () => {
      return getSet("foo").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/sets/foo");
      });
    });
  });

  describe("getSetByTcgId", () => {
    it("requests the sets/:code endpoint", () => {
      return getSetByTcgId(123).then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/sets/tcgplayer/123");
      });
    });
  });
});
