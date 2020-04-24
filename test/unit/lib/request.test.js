"use strict";

const superagent = require("superagent");
const makeRequestFunction = require("../../../lib/request");
const ScryfallError = require("../../../models/scryfall-error");
const GenericScryfallResponse = require("../../../models/generic-scryfall-response");
const fixtures = require("../../fixtures");

describe("makeRequestFunction", function () {
  let fakeResponse, fakeRequest, request;

  beforeEach(function () {
    fakeResponse = {
      text: JSON.stringify(fixtures.card),
    };
    fakeRequest = {
      send: jest.fn().mockReturnThis(),
      set: jest.fn().mockResolvedValue(fakeResponse),
    };
    jest.spyOn(superagent, "get").mockReturnValue(fakeRequest);
    jest.spyOn(superagent, "post").mockReturnValue(fakeRequest);
    request = makeRequestFunction();
  });

  afterEach(function () {
    request.clearQueue();
  });

  it("returns a request function", function () {
    const request = makeRequestFunction();

    expect(request).toBeInstanceOf(Function);
  });

  it("defaults request to get", function () {
    const request = makeRequestFunction();

    expect(request).toBeInstanceOf(Function);

    return request("foo").then(() => {
      expect(superagent.get).toBeCalledTimes(1);
    });
  });

  it("can specify request as post", function () {
    const request = makeRequestFunction();

    expect(request).toBeInstanceOf(Function);

    return request("foo", {
      method: "post",
    }).then(() => {
      expect(superagent.get).toBeCalledTimes(0);
      expect(superagent.post).toBeCalledTimes(1);
    });
  });

  it("automatically rate limits according to Scryfall's recomendation for request frequency of no requests within 100 ms", function () {
    const request = makeRequestFunction();
    let count = 0;
    const intervalRef = setInterval(function () {
      count++;
    }, 1);

    return request("foo")
      .then(() => {
        return request("bar");
      })
      .then(() => {
        return request("baz");
      })
      .then(() => {
        clearInterval(intervalRef);

        expect(count).toBeGreaterThan(100);
        expect(count).toBeLessThan(300);
      });
  });

  it("can configure rate limit", function () {
    const request = makeRequestFunction({
      delayBetweenRequests: 200,
    });
    let count = 0;
    const intervalRef = setInterval(function () {
      count++;
    }, 1);

    return request("foo")
      .then(() => {
        return request("bar");
      })
      .then(() => {
        return request("baz");
      })
      .then(() => {
        clearInterval(intervalRef);

        expect(count).toBeGreaterThan(200);
        expect(count).toBeLessThan(400);
      });
  });

  it("rate limits among multiple requests happening at once", function () {
    const request = makeRequestFunction();
    let count = 0;
    const intervalRef = setInterval(function () {
      count++;
    }, 1);

    return Promise.all([
      request("foo"),
      request("bar"),
      request("baz"),
      request("biz"),
      request("buz"),
    ]).then(() => {
      clearInterval(intervalRef);

      expect(count).toBeGreaterThan(280);
      expect(count).toBeLessThan(400);
    });
  });

  it("does not rate limit a request that occurs after rate limiting from initial request is done", function () {
    let count = 0;
    let intervalRef;

    return request("foo")
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, 200);
        });
      })
      .then(() => {
        intervalRef = setInterval(function () {
          count++;
        }, 1);

        return request("bar");
      })
      .then(() => {
        clearInterval(intervalRef);

        expect(count).toBeLessThan(10);
      });
  });

  it("can pass in textTransformer option", function () {
    const request = makeRequestFunction({
      textTransformer: function (text) {
        return text.replace(
          /{(.)(\/(.))?}/g,
          '<img src="https://example.com/mana-$1$3.png" />'
        );
      },
    });

    return request("foo").then((card) => {
      expect(card.mana_cost).toBe(
        '<img src="https://example.com/mana-2.png" /><img src="https://example.com/mana-U.png" />'
      );
    });
  });

  it("surfaces error about textTransformer when function throws an error", function () {
    const request = makeRequestFunction({
      textTransformer: function () {
        throw new Error("bad function");
      },
    });

    expect.assertions(1);

    return expect(request("foo")).rejects.toMatchObject({
      thrownError: {
        message: "bad function",
      },
    });
  });

  it("can pass in convertSymbolsToSlackEmoji option", function () {
    const request = makeRequestFunction({
      convertSymbolsToSlackEmoji: true,
    });

    return request("foo").then((card) => {
      expect(card.mana_cost).toBe(":mana-2::mana-U:");
    });
  });

  it("can pass in convertSymbolsToDiscordEmoji option", function () {
    const request = makeRequestFunction({
      convertSymbolsToDiscordEmoji: true,
    });

    return request("foo").then((card) => {
      expect(card.mana_cost).toBe(":mana2::manaU:");
    });
  });

  it("prefers textTransformer option over slack emoji option", function () {
    const request = makeRequestFunction({
      convertSymbolsToSlackEmoji: true,
      textTransformer: function (text) {
        return text.replace(
          /{(.)(\/(.))?}/g,
          '<img src="https://example.com/mana-$1$3.png" />'
        );
      },
    });

    return request("foo").then((card) => {
      expect(card.mana_cost).toBe(
        '<img src="https://example.com/mana-2.png" /><img src="https://example.com/mana-U.png" />'
      );
    });
  });

  it("prefers convertSymbolsToSlackEmoji over convertSymbolsToSlackEmoji option", function () {
    const request = makeRequestFunction({
      convertSymbolsToDiscordEmoji: true,
      convertSymbolsToSlackEmoji: true,
    });

    return request("foo").then((card) => {
      expect(card.mana_cost).toBe(":mana-2::mana-U:");
    });
  });

  it("returns a promise", function () {
    expect(request("foo")).toBeInstanceOf(Promise);
  });

  it("makes a request to scryfall", function () {
    return request("foo").then(() => {
      expect(superagent.get).toBeCalledWith("https://api.scryfall.com/foo");
    });
  });

  it("strips out leading /", function () {
    return request("/foo").then(() => {
      expect(superagent.get).toBeCalledWith("https://api.scryfall.com/foo");
    });
  });

  it("allows passing in the full domain", function () {
    return request("https://api.scryfall.com/foo").then(() => {
      expect(superagent.get).toBeCalledWith("https://api.scryfall.com/foo");
    });
  });

  it("resolves with a Scryfall Response", function () {
    fakeRequest.set.mockResolvedValue({
      text: '{"object":"foo"}',
    });

    return request("foo").then((response) => {
      expect(response).toBeInstanceOf(GenericScryfallResponse);
    });
  });

  it("can pass request body", function () {
    return request("foo", {
      method: "post",
      body: { data: "bar" },
    }).then(() => {
      expect(superagent.post).toBeCalledWith("https://api.scryfall.com/foo");
      expect(fakeRequest.send).toBeCalledWith({
        data: "bar",
      });
    });
  });

  it("can pass query params", function () {
    return request("foo", {
      query: { q: "my-query" },
    }).then(() => {
      expect(superagent.get).toBeCalledWith(
        "https://api.scryfall.com/foo?q=my-query"
      );
    });
  });

  it("can pass object as multiple query params", function () {
    return request("foo", {
      query: {
        q: "my-query",
        bar: "baz",
      },
    }).then(() => {
      expect(superagent.get).toBeCalledWith(
        "https://api.scryfall.com/foo?q=my-query&bar=baz"
      );
    });
  });

  it("can pass object as query params when url already has query params", function () {
    return request("foo?firstQuery=bar", {
      query: { q: "my-query" },
    }).then(() => {
      expect(superagent.get).toBeCalledWith(
        "https://api.scryfall.com/foo?firstQuery=bar&q=my-query"
      );
    });
  });

  it("uri encodes the query string params", function () {
    return request("foo", {
      query: {
        q: 'o:vigilance t:equipment o:"draw cards"',
      },
    }).then(() => {
      expect(superagent.get).toBeCalledWith(
        "https://api.scryfall.com/foo?q=o%3Avigilance%20t%3Aequipment%20o%3A%22draw%20cards%22"
      );
    });
  });

  it("rejects when https.get errors", function () {
    const error = new Error("https error");

    fakeRequest.set.mockRejectedValue(error);

    expect.assertions(1);

    return expect(request("foo")).rejects.toMatchObject({
      originalError: error,
      message:
        "An unexpected error occurred when requesting resources from Scryfall.",
    });
  });

  it("rejects when JSON response is not parsable", async function () {
    fakeRequest.set.mockResolvedValue("{");

    expect.assertions(2);

    await expect(request("foo")).rejects.toBeInstanceOf(ScryfallError);
    await expect(request("foo")).rejects.toMatchObject({
      message: "Could not parse response from Scryfall.",
    });
  });

  it("rejects when body is an error object", async function () {
    fakeRequest.set.mockResolvedValue({
      text: JSON.stringify({
        object: "error",
        code: "not_found",
        status: 404,
        details: "Failure",
      }),
    });

    expect.assertions(2);

    await expect(request("foo")).rejects.toBeInstanceOf(ScryfallError);
    await expect(request("foo")).rejects.toMatchObject({
      message: "Failure",
      status: 404,
    });
  });
});
