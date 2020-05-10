import { getSet } from "Api/sets";
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

  describe("getSet", () => {
    it("requests the set/:code endpoint", () => {
      return getSet("foo").then(() => {
        expect(fakeGet).toBeCalledTimes(1);
        expect(fakeGet).toBeCalledWith("/sets/foo");
      });
    });
  });
});
