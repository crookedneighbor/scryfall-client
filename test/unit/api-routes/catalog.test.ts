import { getCatalog } from "Api/catalog";
import { get } from "Lib/api-request";

vi.mock("Lib/api-request");

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
