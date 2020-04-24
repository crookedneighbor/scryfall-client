"use strict";

const superagent = require("superagent");
const makeRequestFunction = require("../../../lib/request");
const ScryfallError = require("../../../models/scryfall-error");
const GenericScryfallResponse = require("../../../models/generic-scryfall-response");

describe("makeRequestFunction", function () {
  beforeEach(function () {
    this.fakeResponse = {
      text: JSON.stringify(this.fixtures.card),
    };
    this.fakeRequest = {
      send: this.sandbox.stub().returnsThis(),
      set: this.sandbox.stub().resolves(this.fakeResponse),
    };
    this.sandbox.stub(superagent, "get").returns(this.fakeRequest);
    this.sandbox.stub(superagent, "post").returns(this.fakeRequest);
    this.request = makeRequestFunction();
  });

  afterEach(function () {
    this.request.clearQueue();
  });

  it("returns a request function", function () {
    const request = makeRequestFunction();

    expect(request).to.be.an.instanceof(Function);
  });

  it("defaults request to get", function () {
    const request = makeRequestFunction();

    expect(request).to.be.an.instanceof(Function);

    return request("foo").then(() => {
      expect(superagent.get.callCount).to.equal(1);
    });
  });

  it("can specify request as post", function () {
    const request = makeRequestFunction();

    expect(request).to.be.an.instanceof(Function);

    return request("foo", {
      method: "post",
    }).then(() => {
      expect(superagent.get.callCount).to.equal(0);
      expect(superagent.post.callCount).to.equal(1);
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

        expect(count).to.be.greaterThan(100);
        expect(count).to.be.lessThan(300);
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

        expect(count).to.be.greaterThan(200);
        expect(count).to.be.lessThan(400);
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

      expect(count).to.be.greaterThan(280);
      expect(count).to.be.lessThan(400);
    });
  });

  it("does not rate limite a request that occurs after rate limiting from initial request is done", function () {
    const request = makeRequestFunction();
    let count = 0;
    let intervalRef;
    const wait = function (time) {
      return new Promise((resolve) => {
        setTimeout(resolve, time);
      });
    };

    return request("foo")
      .then(() => {
        return wait(100);
      })
      .then(() => {
        intervalRef = setInterval(function () {
          count++;
        }, 1);

        return request("bar");
      })
      .then(() => {
        clearInterval(intervalRef);

        expect(count).to.be.lessThan(10);
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
      expect(card.mana_cost).to.equal(
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

    return request("foo")
      .then(this.expectToReject)
      .catch(function (err) {
        expect(err.thrownError.message).to.equal("bad function");
      });
  });

  it("can pass in convertSymbolsToSlackEmoji option", function () {
    const request = makeRequestFunction({
      convertSymbolsToSlackEmoji: true,
    });

    return request("foo").then((card) => {
      expect(card.mana_cost).to.equal(":mana-2::mana-U:");
    });
  });

  it("can pass in convertSymbolsToDiscordEmoji option", function () {
    const request = makeRequestFunction({
      convertSymbolsToDiscordEmoji: true,
    });

    return request("foo").then((card) => {
      expect(card.mana_cost).to.equal(":mana2::manaU:");
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
      expect(card.mana_cost).to.equal(
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
      expect(card.mana_cost).to.equal(":mana-2::mana-U:");
    });
  });

  it("returns a promise", function () {
    expect(this.request("foo")).to.be.an.instanceof(Promise);
  });

  it("makes a request to scryfall", function () {
    return this.request("foo").then(() => {
      expect(superagent.get).to.be.calledWith("https://api.scryfall.com/foo");
    });
  });

  it("strips out leading /", function () {
    return this.request("/foo").then(() => {
      expect(superagent.get).to.be.calledWith("https://api.scryfall.com/foo");
    });
  });

  it("allows passing in the full domain", function () {
    return this.request("https://api.scryfall.com/foo").then(() => {
      expect(superagent.get).to.be.calledWith("https://api.scryfall.com/foo");
    });
  });

  it("resolves with a Scryfall Response", function () {
    this.fakeRequest.set.resolves({
      text: '{"object":"foo"}',
    });

    return this.request("foo").then((response) => {
      expect(response).to.be.an.instanceof(GenericScryfallResponse);
    });
  });

  it("can pass request body", function () {
    return this.request("foo", {
      method: "post",
      body: { data: "bar" },
    }).then(() => {
      expect(superagent.post).to.be.calledWith("https://api.scryfall.com/foo");
      expect(this.fakeRequest.send).to.be.calledWith({
        data: "bar",
      });
    });
  });

  it("can pass query params", function () {
    return this.request("foo", {
      query: { q: "my-query" },
    }).then(() => {
      expect(superagent.get).to.be.calledWith(
        "https://api.scryfall.com/foo?q=my-query"
      );
    });
  });

  it("can pass object as multiple query params", function () {
    return this.request("foo", {
      query: {
        q: "my-query",
        bar: "baz",
      },
    }).then(() => {
      expect(superagent.get).to.be.calledWith(
        "https://api.scryfall.com/foo?q=my-query&bar=baz"
      );
    });
  });

  it("can pass object as query params when url already has query params", function () {
    return this.request("foo?firstQuery=bar", {
      query: { q: "my-query" },
    }).then(() => {
      expect(superagent.get).to.be.calledWith(
        "https://api.scryfall.com/foo?firstQuery=bar&q=my-query"
      );
    });
  });

  it("uri encodes the query string params", function () {
    return this.request("foo", {
      query: {
        q: 'o:vigilance t:equipment o:"draw cards"',
      },
    }).then(() => {
      expect(superagent.get).to.be.calledWith(
        "https://api.scryfall.com/foo?q=o%3Avigilance%20t%3Aequipment%20o%3A%22draw%20cards%22"
      );
    });
  });

  it("rejects when https.get errors", function () {
    const error = new Error("https error");

    this.fakeRequest.set.rejects(error);

    return this.request("foo")
      .then(this.expectToReject)
      .catch((err) => {
        expect(err.originalError).to.equal(error);
        expect(err.message).to.equal(
          "An unexpected error occurred when requesting resources from Scryfall."
        );
      });
  });

  it("rejects when JSON response is not parsable", function () {
    this.fakeRequest.set.resolves("{");

    return this.request("foo")
      .then(this.expectToReject)
      .catch((err) => {
        expect(err).to.be.an.instanceof(ScryfallError);
        expect(err.message).to.equal("Could not parse response from Scryfall.");
      });
  });

  it("rejects when body is an error object", function () {
    this.fakeRequest.set.resolves({
      text: JSON.stringify({
        object: "error",
        code: "not_found",
        status: 404,
        details: "Failure",
      }),
    });

    return this.request("foo")
      .then(this.expectToReject)
      .catch((err) => {
        expect(err).to.be.an.instanceof(ScryfallError);
        expect(err.message).to.equal("Failure");
        expect(err.status).to.equal(404);
      });
  });
});
