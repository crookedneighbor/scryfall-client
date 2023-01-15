import sendRequest from "Lib/api-request/send-request";
import ScryfallError from "Models/scryfall-error";
import superagent = require("superagent");
import { vi } from "vitest";

let mockResponse: {
  text: string;
};

let agent;

describe("sendRequest", () => {
  beforeEach(() => {
    mockResponse = { text: "{}" };

    agent = {
      send: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((callback) => {
        return new Promise((resolve) => {
          return resolve(callback(mockResponse));
        });
      }),
    };

    vi.spyOn(superagent, "get").mockReturnValue(agent);
    vi.spyOn(superagent, "post").mockReturnValue(agent);
  });

  it("sends a get request", () => {
    return sendRequest({
      method: "get",
      url: "https://example.com",
    }).then(() => {
      expect(superagent.get).toBeCalledTimes(1);
      expect(superagent.get).toBeCalledWith("https://example.com");
    });
  });

  it("can send a post request with body", () => {
    const body = { foo: "bar" };

    return sendRequest({
      method: "post",
      url: "https://example.com",
      body,
    }).then(() => {
      expect(superagent.post).toBeCalledTimes(1);
      expect(superagent.post).toBeCalledWith("https://example.com");
      expect(agent.send).toBeCalledTimes(1);
      expect(agent.send).toBeCalledWith(body);
    });
  });

  it("falls back to get request if post has no body", () => {
    return sendRequest({
      method: "post",
      url: "https://example.com",
    }).then(() => {
      expect(superagent.post).toBeCalledTimes(0);
      expect(superagent.get).toBeCalledTimes(1);
      expect(superagent.get).toBeCalledWith("https://example.com");
    });
  });

  it("handles parsing errors", async () => {
    mockResponse.text = "{";

    expect.assertions(2);

    await expect(
      sendRequest({
        method: "get",
        url: "https://example.com",
      })
    ).rejects.toBeInstanceOf(ScryfallError);
    await expect(
      sendRequest({
        method: "get",
        url: "https://example.com",
      })
    ).rejects.toMatchObject({
      message: "Could not parse response from Scryfall.",
    });
  });

  it("handles scryfall api errors", async () => {
    mockResponse.text = JSON.stringify({
      object: "error",
      details: "Error from API",
    });

    expect.assertions(2);

    await expect(
      sendRequest({
        method: "get",
        url: "https://example.com",
      })
    ).rejects.toBeInstanceOf(ScryfallError);
    await expect(
      sendRequest({
        method: "get",
        url: "https://example.com",
      })
    ).rejects.toMatchObject({
      message: "Error from API",
    });
  });
});
