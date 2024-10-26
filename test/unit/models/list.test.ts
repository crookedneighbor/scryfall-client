import wrapScryfallResponse from "../../../src/lib/wrap-scryfall-response";
import List from "../../../src/models/list";
import { listOfCardsFixture, listOfCardsPage2Fixture } from "../../fixtures";
import { get } from "../../../src/lib/api-request";

vi.mock("../../../src/lib/api-request");

describe("List", function () {
  let fakeRequest: vi.SpyInstance;

  beforeEach(() => {
    fakeRequest = vi.mocked(get);
  });

  afterEach(() => {
    fakeRequest.mockReset();
  });

  it("inherits from Array", function () {
    const list = new List(listOfCardsFixture);

    expect(list).toBeInstanceOf(Array);
    expect(list).toBeInstanceOf(List);
  });

  it("its entries are defined by data properties", function () {
    const list = new List(listOfCardsFixture);

    expect(typeof list[0].name).toBe("string");
    expect(list[0].name).toBe(listOfCardsFixture.data[0].name);
    expect(typeof list[1].name).toBe("string");
    expect(list[1].name).toBe(listOfCardsFixture.data[1].name);
  });

  it("responds to Array methods", function () {
    const list = new List(listOfCardsFixture);

    expect(list.length).toBe(2);

    list.push({ foo: "bar" });
    expect(list.length).toBe(3);

    list.pop();
    expect(list.length).toBe(2);

    const names = list.map((entry) => entry.name);

    expect(names).toBeInstanceOf(Array);
    expect(names).not.toBeInstanceOf(List);
    expect(names[0]).toBe(listOfCardsFixture.data[0].name);
    expect(names[1]).toBe(listOfCardsFixture.data[1].name);
  });

  it("applies properties to object", function () {
    const list = new List(listOfCardsFixture);

    expect(list.total_cards).toBeGreaterThan(0);
    expect(list.total_cards).toBe(listOfCardsFixture.total_cards);
    expect(list.has_more).toBe(true);
    expect(list.has_more).toBe(listOfCardsFixture.has_more);
  });

  describe("next", function () {
    beforeEach(function () {
      fakeRequest.mockResolvedValue(
        wrapScryfallResponse(listOfCardsPage2Fixture),
      );
    });

    it("makes a request for the next page", function () {
      const list = new List(listOfCardsFixture);

      return list.next().then((list2) => {
        expect(fakeRequest).toBeCalledWith(listOfCardsFixture.next_page);
        expect(list2[0].name).toBe(listOfCardsPage2Fixture.data[0].name);
      });
    });

    it("rejects promise if there are no additional results", function () {
      const list = new List(listOfCardsFixture);

      list.has_more = false;

      return expect(list.next()).rejects.toMatchObject({
        message: "No additional pages.",
      });
    });
  });
});
