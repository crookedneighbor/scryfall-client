import getUrl from "../../../../src/lib/api-request/get-url";

describe("getUrl", () => {
  it("adds api.scryfall.com to url", () => {
    expect(getUrl("foo")).toBe("https://api.scryfall.com/foo");
  });

  it("adds api.scryfall.com to url with slash", () => {
    expect(getUrl("/foo")).toBe("https://api.scryfall.com/foo");
  });

  it("noops when url already has domain", () => {
    expect(getUrl("https://api.scryfall.com/foo")).toBe(
      "https://api.scryfall.com/foo"
    );
  });

  it("adds query param", () => {
    expect(
      getUrl("/foo", {
        q: "foo",
      })
    ).toBe("https://api.scryfall.com/foo?q=foo");
  });

  it("adds multiple query params", () => {
    expect(
      getUrl("/foo", {
        q: "foo",
        x: "bar",
      })
    ).toBe("https://api.scryfall.com/foo?q=foo&x=bar");
  });

  it("adds query params to url that already has query params", () => {
    expect(
      getUrl("/foo?a=baz", {
        q: "foo",
        x: "bar",
      })
    ).toBe("https://api.scryfall.com/foo?a=baz&q=foo&x=bar");
  });
});
