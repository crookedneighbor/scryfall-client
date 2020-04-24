"use strict";

const wrapScryfallResponse = require("../../../lib/wrap-scryfall-response");
const Card = require("../../../models/card");
const Catalog = require("../../../models/catalog");
const List = require("../../../models/list");
const Set = require("../../../models/set");
const GenericScryfallResponse = require("../../../models/generic-scryfall-response");

describe("wrapScryfallResponse", function () {
  let fakeRequestObject, options;

  beforeEach(function () {
    fakeRequestObject = {};
    options = {
      requestMethod: fakeRequestObject,
    };
  });

  it("wraps generic objects with GenericScryfallResponse", function () {
    const wrappedResponse = wrapScryfallResponse(
      {
        object: "foo",
        foo: "bar",
      },
      options
    );

    expect(wrappedResponse).toBeInstanceOf(GenericScryfallResponse);
  });

  it("wraps card responses in Card", function () {
    const wrappedResponse = wrapScryfallResponse(
      {
        object: "card",
        foo: "bar",
      },
      options
    );

    expect(wrappedResponse).toBeInstanceOf(Card);
    expect(wrappedResponse.foo).toBe("bar");
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
      options
    );

    expect(wrappedResponse).toBeInstanceOf(List);
    expect(wrappedResponse.length).toBe(2);
    expect(wrappedResponse[0]).toBeInstanceOf(Card);
  });

  it("wraps catalog responses in cist", function () {
    const wrappedResponse = wrapScryfallResponse(
      {
        object: "catalog",
        data: ["foo", "bar"],
      },
      options
    );

    expect(wrappedResponse).toBeInstanceOf(Catalog);
    expect(wrappedResponse.length).toBe(2);
    expect(wrappedResponse[0]).toBe("foo");
  });

  it("wraps set responses in Set", function () {
    const wrappedResponse = wrapScryfallResponse(
      {
        object: "set",
        code: "DOM",
      },
      options
    );

    expect(wrappedResponse).toBeInstanceOf(Set);
    expect(wrappedResponse.code).toBe("DOM");
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
      options
    );

    expect(wrappedResponse).toBeInstanceOf(GenericScryfallResponse);
    expect(wrappedResponse.related_card).toBeInstanceOf(Card);
    expect(wrappedResponse.nested_thing.more_nesting).toBeInstanceOf(Card);
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
      options
    );

    expect(wrappedResponse).toBeInstanceOf(GenericScryfallResponse);
    expect(wrappedResponse.related_cards[0]).toBeInstanceOf(Card);
    expect(wrappedResponse.related_cards[1]).toBeInstanceOf(Card);
    expect(wrappedResponse.nested_thing.more_nesting[0]).toBeInstanceOf(Card);
  });

  it("can pass a text transformer function", function () {
    options.textTransformer = function (text) {
      return text.replace("{t}", "TAP!");
    };

    expect(wrapScryfallResponse("Foo {t} bar", options)).toBe("Foo TAP! bar");
  });

  it("can use a text transformer in nested objects", function () {
    options.textTransformer = function (text) {
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
      options
    );

    expect(wrappedResponse.foo).toBe("<G/R> FOO");
    expect(wrappedResponse.related_cards[1].foo).toBe("<T> FOO");
    expect(wrappedResponse.nested_thing.more_nesting[0].foo).toBe("<R> BAR");
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
      options
    );

    expect(wrappedResponse.foo).toBe("{g/r} foo");
    expect(wrappedResponse.related_cards[1].foo).toBe("{t} foo");
    expect(wrappedResponse.nested_thing.more_nesting[0].foo).toBe("{r} bar");
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
      options
    );

    expect(wrappedResponse.foo).toBe("{g/r} foo");
    expect(wrappedResponse.related_cards[1].foo).toBe("{t} foo");
    expect(wrappedResponse.nested_thing.more_nesting[0].foo).toBe("{r} bar");
  });
});
