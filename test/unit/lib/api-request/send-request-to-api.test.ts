import apiRequest from "Lib/api-request/send-request-to-api";
import sendRequest from "Lib/api-request/send-request";
import getUrl from "Lib/api-request/get-url";
import enqueTask from "Lib/api-request/enque-task";
import ScryfallError from "Models/scryfall-error";
import wrapScryfallResponse from "Lib/wrap-scryfall-response";
import fixtures from "Fixtures";

import { mocked } from "ts-jest/utils";

jest.mock("Lib/api-request/send-request");
jest.mock("Lib/api-request/enque-task");
jest.mock("Lib/api-request/get-url");
jest.mock("Lib/wrap-scryfall-response");

describe("apiRequest", () => {
  let enqueSpy: jest.SpyInstance;
  let requestSpy: jest.SpyInstance;
  let urlSpy: jest.SpyInstance;
  let wrapSpy: jest.SpyInstance;

  beforeEach(() => {
    enqueSpy = mocked(enqueTask);
    requestSpy = mocked(sendRequest);
    urlSpy = mocked(getUrl);
    wrapSpy = mocked(wrapScryfallResponse);

    requestSpy.mockResolvedValue(fixtures.card);
  });

  afterEach(() => {
    enqueSpy.mockClear();
    requestSpy.mockClear();
    urlSpy.mockClear();
    wrapSpy.mockClear();
  });

  it("enques a request task", () => {
    return apiRequest({
      endpoint: "foo",
      method: "get",
    }).then(() => {
      expect(enqueSpy).toBeCalledTimes(1);
      expect(enqueSpy).toBeCalledWith(expect.any(Function));
    });
  });

  it("makes a get request", () => {
    return apiRequest({
      endpoint: "foo",
      method: "get",
    }).then(() => {
      expect(urlSpy).toBeCalledTimes(1);
      expect(urlSpy).toBeCalledWith("foo", undefined);
      expect(requestSpy).toBeCalledTimes(1);
      expect(requestSpy).toBeCalledWith({
        url: "https://api.scryfall.com/endpoint",
        method: "get",
      });
    });
  });

  it("makes a get request with a query parameter", () => {
    return apiRequest({
      endpoint: "foo",
      method: "get",
      query: {
        q: "foo",
      },
    }).then(() => {
      expect(urlSpy).toBeCalledTimes(1);
      expect(urlSpy).toBeCalledWith("foo", { q: "foo" });
      expect(requestSpy).toBeCalledTimes(1);
      expect(requestSpy).toBeCalledWith({
        url: "https://api.scryfall.com/endpoint",
        method: "get",
      });
    });
  });

  it("makes a post request", () => {
    return apiRequest({
      endpoint: "foo",
      method: "post",
    }).then(() => {
      expect(urlSpy).toBeCalledTimes(1);
      expect(urlSpy).toBeCalledWith("foo", undefined);
      expect(requestSpy).toBeCalledTimes(1);
      expect(requestSpy).toBeCalledWith({
        url: "https://api.scryfall.com/endpoint",
        method: "post",
      });
    });
  });

  it("makes a post request with a post body", () => {
    return apiRequest({
      endpoint: "foo",
      method: "post",
      body: {
        q: "foo",
      },
    }).then(() => {
      expect(urlSpy).toBeCalledTimes(1);
      expect(urlSpy).toBeCalledWith("foo", undefined);
      expect(requestSpy).toBeCalledTimes(1);
      expect(requestSpy).toBeCalledWith({
        url: "https://api.scryfall.com/endpoint",
        method: "post",
        body: {
          q: "foo",
        },
      });
    });
  });

  it("wraps request response", () => {
    return apiRequest({
      endpoint: "foo",
      method: "get",
    }).then((card) => {
      expect(wrapSpy).toBeCalledTimes(1);
      expect(wrapSpy).toBeCalledWith(card);
    });
  });

  it("provides a Scryfall Error when api call fails", () => {
    expect.assertions(4);

    const err = {
      message: "something went wrong",
      status: 500,
    };

    requestSpy.mockRejectedValue(err);

    return apiRequest({
      endpoint: "foo",
      method: "get",
    }).catch((e) => {
      expect(e).toBeInstanceOf(ScryfallError);
      expect(e.message).toBe(
        "An unexpected error occurred when requesting resources from Scryfall."
      );
      expect(e.status).toBe(500);
      expect(e.originalError).toBe(err);
    });
  });

  it("provides a Scryfall Error when wrapping response fails", () => {
    expect.assertions(3);

    const err = new Error("something went wrong");

    wrapSpy.mockImplementation(() => {
      throw err;
    });

    return apiRequest({
      endpoint: "foo",
      method: "get",
    }).catch((e) => {
      expect(e).toBeInstanceOf(ScryfallError);
      expect(e.message).toBe(
        "Something went wrong when wrapping the response from Scryfall"
      );
      expect(e.thrownError).toBe(err);
    });
  });
});
