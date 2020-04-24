"use strict";

const wrapScryfallResponse = require("../../../lib/wrap-scryfall-response");
const Card = require("../../../models/card");
const Catalog = require("../../../models/catalog");
const List = require("../../../models/list");
const Set = require("../../../models/set");
const GenericScryfallResponse = require("../../../models/generic-scryfall-response");

describe("wrapScryfallResponse", function () {
  beforeEach(function () {
    this.fakeRequestObject = {};
    this.options = {
      requestMethod: this.fakeRequestObject,
    };
  });

  it("wraps generic objects with GenericScryfallResponse", function () {
    const wrappedResponse = wrapScryfallResponse(
      {
        object: "foo",
        foo: "bar",
      },
      this.options
    );

    expect(wrappedResponse).to.be.an.instanceof(GenericScryfallResponse);
  });

  it("wraps card responses in Card", function () {
    const wrappedResponse = wrapScryfallResponse(
      {
        object: "card",
        foo: "bar",
      },
      this.options
    );

    expect(wrappedResponse).to.be.an.instanceof(Card);
    expect(wrappedResponse.foo).to.equal("bar");
  });

  it("wraps list responses in List", function () {
    const wrappedResponse = wrapScryfallResponse(
      {
        object: "list",
        data: [
          {
            object: "card",
            foo: "bar",
          },
          {
            object: "card",
            foo: "bar",
          },
        ],
      },
      this.options
    );

    expect(wrappedResponse).to.be.an.instanceof(List);
    expect(wrappedResponse.length).to.equal(2);
    expect(wrappedResponse[0]).to.be.an.instanceof(Card);
  });

  it("wraps catalog responses in cist", function () {
    const wrappedResponse = wrapScryfallResponse(
      {
        object: "catalog",
        data: ["foo", "bar"],
      },
      this.options
    );

    expect(wrappedResponse).to.be.an.instanceof(Catalog);
    expect(wrappedResponse.length).to.equal(2);
    expect(wrappedResponse[0]).to.equal("foo");
  });

  it("wraps set responses in Set", function () {
    const wrappedResponse = wrapScryfallResponse(
      {
        object: "set",
        code: "DOM",
      },
      this.options
    );

    expect(wrappedResponse).to.be.an.instanceof(Set);
    expect(wrappedResponse.code).to.equal("DOM");
  });

  it("wraps nested properties", function () {
    const wrappedResponse = wrapScryfallResponse(
      {
        object: "foo",
        foo: "bar",
        related_card: {
          object: "card",
          foo: "bar",
        },
        nested_thing: {
          more_nesting: {
            object: "card",
            foo: "bar",
          },
        },
      },
      this.options
    );

    expect(wrappedResponse).to.be.an.instanceof(GenericScryfallResponse);
    expect(wrappedResponse.related_card).to.be.an.instanceof(Card);
    expect(wrappedResponse.nested_thing.more_nesting).to.be.an.instanceof(Card);
  });

  it("wraps objects in an array", function () {
    const wrappedResponse = wrapScryfallResponse(
      {
        object: "foo",
        foo: "bar",
        related_cards: [
          {
            object: "card",
            foo: "bar",
          },
          {
            object: "card",
            foo: "baz",
          },
        ],
        nested_thing: {
          more_nesting: [
            {
              object: "card",
              foo: "bar",
            },
          ],
        },
      },
      this.options
    );

    expect(wrappedResponse).to.be.an.instanceof(GenericScryfallResponse);
    expect(wrappedResponse.related_cards[0]).to.be.an.instanceof(Card);
    expect(wrappedResponse.related_cards[1]).to.be.an.instanceof(Card);
    expect(wrappedResponse.nested_thing.more_nesting[0]).to.be.an.instanceof(
      Card
    );
  });

  it("can pass a text transformer function", function () {
    this.options.textTransformer = function (text) {
      return text.replace("{t}", "TAP!");
    };

    expect(wrapScryfallResponse("Foo {t} bar", this.options)).to.equal(
      "Foo TAP! bar"
    );
  });

  it("can use a text transformer in nested objects", function () {
    this.options.textTransformer = function (text) {
      var replacement = text.replace(/{(.*)}/, "<$1>");

      return replacement.toUpperCase();
    };

    const wrappedResponse = wrapScryfallResponse(
      {
        object: "foo",
        foo: "{g/r} foo",
        related_cards: [
          {
            object: "card",
            foo: "bar",
          },
          {
            object: "card",
            foo: "{t} foo",
          },
        ],
        nested_thing: {
          more_nesting: [
            {
              object: "card",
              foo: "{r} bar",
            },
          ],
        },
      },
      this.options
    );

    expect(wrappedResponse.foo).to.equal("<G/R> FOO");
    expect(wrappedResponse.related_cards[1].foo).to.equal("<T> FOO");
    expect(wrappedResponse.nested_thing.more_nesting[0].foo).to.equal(
      "<R> BAR"
    );
  });

  it("does not convert symbols to slack emoji if not explicitly passed in", function () {
    const wrappedResponse = wrapScryfallResponse(
      {
        object: "foo",
        foo: "{g/r} foo",
        related_cards: [
          {
            object: "card",
            foo: "bar",
          },
          {
            object: "card",
            foo: "{t} foo",
          },
        ],
        nested_thing: {
          more_nesting: [
            {
              object: "card",
              foo: "{r} bar",
            },
          ],
        },
      },
      this.options
    );

    expect(wrappedResponse.foo).to.equal("{g/r} foo");
    expect(wrappedResponse.related_cards[1].foo).to.equal("{t} foo");
    expect(wrappedResponse.nested_thing.more_nesting[0].foo).to.equal(
      "{r} bar"
    );
  });

  it("does not convert symbols to discord emoji if not explicitly passed in", function () {
    const wrappedResponse = wrapScryfallResponse(
      {
        object: "foo",
        foo: "{g/r} foo",
        related_cards: [
          {
            object: "card",
            foo: "bar",
          },
          {
            object: "card",
            foo: "{t} foo",
          },
        ],
        nested_thing: {
          more_nesting: [
            {
              object: "card",
              foo: "{r} bar",
            },
          ],
        },
      },
      this.options
    );

    expect(wrappedResponse.foo).to.equal("{g/r} foo");
    expect(wrappedResponse.related_cards[1].foo).to.equal("{t} foo");
    expect(wrappedResponse.nested_thing.more_nesting[0].foo).to.equal(
      "{r} bar"
    );
  });
});
