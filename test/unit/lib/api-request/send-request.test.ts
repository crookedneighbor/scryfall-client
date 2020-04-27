import sendRequest from "Lib/api-request/send-request";
import superagent = require("superagent");

jest.mock("superagent");

describe("sendRequest", () => {
  let getSpy: jest.SpyInstance;
  let postSpy: jest.SpyInstance;
  let sendSpy: jest.SpyInstance;

  beforeEach(() => {
    getSpy = jest.spyOn(superagent, "get").mockReturnThis();
    postSpy = jest.spyOn(superagent, "post").mockReturnThis();
    sendSpy = jest.spyOn(superagent as any, "send").mockReturnThis();
  });

  it("sends a get request", () => {
    return sendRequest({
      method: "get",
      url: "https://example.com",
    }).then((response) => {
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
    }).then((response) => {
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
    }).then((response) => {
      expect(postSpy).toBeCalledTimes(0);
      expect(getSpy).toBeCalledTimes(1);
      expect(getSpy).toBeCalledWith("https://example.com");
    });
  });
});