import { getCatalog } from "Api/catalog";
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

  describe("getCatalog", () => {
    it("requests the catalog endpoint", () => {
      return getCatalog("card-names").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/catalog/card-names");
      });
    });
  });
});
