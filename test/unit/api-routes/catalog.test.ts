import { getCatalog } from "Api/catalog";
import { get } from "Lib/api-request";

import { mocked } from "ts-jest/utils";

jest.mock("Lib/api-request");

describe("/sets", () => {
  let fakeGet: jest.SpyInstance;

  beforeEach(() => {
    fakeGet = mocked(get);
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
