import { getCatalog } from "../../../src/api-routes/catalog";
import { get } from "../../../src/lib/api-request";

vi.mock("../../../src/lib/api-request");

describe("/sets", () => {
  beforeEach(() => {
    get.mockResolvedValue({});
  });

  describe("getCatalog", () => {
    it("requests the catalog endpoint", () => {
      return getCatalog("card-names").then(() => {
        expect(get).toBeCalledTimes(1);
        expect(get).toBeCalledWith("/catalog/card-names");
      });
    });
  });
});
