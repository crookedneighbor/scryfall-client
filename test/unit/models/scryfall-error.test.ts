"use strict";

import ScryfallError from "Models/scryfall-error";

describe("ScryfallError", function () {
  it("inherits from Error", function () {
    const error = new ScryfallError({});

    expect(error).toBeInstanceOf(Error);
  });

  it("uses message from object", function () {
    const error = new ScryfallError({
      message: "custom message",
    });

    expect(error.message).toBe("custom message");
  });

  it("uses details for message from object if no message exists", function () {
    const error = new ScryfallError({
      object: "error",
      code: "not_found",
      status: 404,
      details: "Message",
    });

    expect(error.message).toBe("Message");
  });

  it("prefers message over details", function () {
    const error = new ScryfallError({
      object: "error",
      code: "not_found",
      status: 404,
      message: "message",
      details: "details",
    });

    expect(error.message).toBe("message");
  });

  it("passes on all properties", function () {
    const error = new ScryfallError({
      object: "error",
      code: "not_found",
      type: "ambiguous",
      status: 404,
      details:
        "Too many cards match ambiguous name “jace”. Add more words to refine your search.",
    });

    expect(error.code).toBe("not_found");
    expect(error.status).toBe(404);
    expect(error.details).toBe(
      "Too many cards match ambiguous name “jace”. Add more words to refine your search.",
    );
    expect(error.type).toBe("ambiguous");
  });
});
