import sendRequest from "Lib/api-request/send-request";
import ScryfallError from "Models/scryfall-error";
import superagent = require("superagent");

import { mocked } from "ts-jest/utils";

let mockResponse: {
  text: string;
};

jest.mock("superagent", () => {
  return {
    post: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    then: jest.fn().mockImplementation((callback) => {
      return new Promise((resolve) => {
        return resolve(callback(mockResponse));
      });
    }),
  };
});

const getSpy = mocked(superagent.get);
const postSpy = mocked(superagent.post);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendSpy = mocked((superagent as any).send);

describe("sendRequest", () => {
  beforeEach(() => {
    mockResponse = { text: "{}" };
  });

  afterEach(() => {
    getSpy.mockClear();
    postSpy.mockClear();
    sendSpy.mockClear();
  });

  it("sends a get request", () => {
    return sendRequest({
      method: "get",
      url: "https://example.com",
    }).then(() => {
      expect(getSpy).toBeCalledTimes(1);
      expect(getSpy).toBeCalledWith("https://example.com");
    });
  });

  it("can send a post request with body", () => {
    const body = { foo: "bar" };

    return sendRequest({
      method: "post",
      url: "https://example.com",
      body,
    }).then(() => {
      expect(postSpy).toBeCalledTimes(1);
      expect(postSpy).toBeCalledWith("https://example.com");
      expect(sendSpy).toBeCalledTimes(1);
      expect(sendSpy).toBeCalledWith(body);
    });
  });

  it("falls back to get request if post has no body", () => {
    return sendRequest({
      method: "post",
      url: "https://example.com",
    }).then(() => {
      expect(postSpy).toBeCalledTimes(0);
      expect(getSpy).toBeCalledTimes(1);
      expect(getSpy).toBeCalledWith("https://example.com");
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
