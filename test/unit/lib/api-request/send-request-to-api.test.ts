import apiRequest from "Lib/api-request/send-request-to-api";
import sendRequest from "Lib/api-request/send-request";
import getUrl from "Lib/api-request/get-url";
import enqueTask from "Lib/api-request/enque-task";
import ScryfallError from "Models/scryfall-error";
import wrapScryfallResponse from "Lib/wrap-scryfall-response";
import fixtures from "Fixtures";

vi.mock("Lib/api-request/send-request");
vi.mock("Lib/api-request/enque-task");
vi.mock("Lib/api-request/get-url");
vi.mock("Lib/wrap-scryfall-response");

describe("apiRequest", () => {
  beforeEach(() => {
    getUrl.mockReturnValue("https://api.scryfall.com/endpoint");
    sendRequest.mockResolvedValue(fixtures.card);
    enqueTask.mockImplementation((fn) => {
      return Promise.resolve().then(() => {
        return fn();
      });
    });
  });

  it("enques a request task", () => {
    return apiRequest({
      endpoint: "foo",
      method: "get",
    }).then(() => {
      expect(enqueTask).toBeCalledTimes(1);
      expect(enqueTask).toBeCalledWith(expect.any(Function));
    });
  });

  it("makes a get request", () => {
    return apiRequest({
      endpoint: "foo",
      method: "get",
    }).then(() => {
      expect(getUrl).toBeCalledTimes(1);
      expect(getUrl).toBeCalledWith("foo", undefined);
      expect(sendRequest).toBeCalledTimes(1);
      expect(sendRequest).toBeCalledWith({
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
      expect(getUrl).toBeCalledTimes(1);
      expect(getUrl).toBeCalledWith("foo", { q: "foo" });
      expect(sendRequest).toBeCalledTimes(1);
      expect(sendRequest).toBeCalledWith({
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
      expect(getUrl).toBeCalledTimes(1);
      expect(getUrl).toBeCalledWith("foo", undefined);
      expect(sendRequest).toBeCalledTimes(1);
      expect(sendRequest).toBeCalledWith({
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
      expect(getUrl).toBeCalledTimes(1);
      expect(getUrl).toBeCalledWith("foo", undefined);
      expect(sendRequest).toBeCalledTimes(1);
      expect(sendRequest).toBeCalledWith({
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
      expect(wrapScryfallResponse).toBeCalledTimes(1);
      expect(wrapScryfallResponse).toBeCalledWith(card);
    });
  });

  it("provides a Scryfall Error when api call fails", () => {
    expect.assertions(4);

    const err = {
      message: "something went wrong",
      status: 500,
    };

    sendRequest.mockRejectedValue(err);

    return apiRequest({
      endpoint: "foo",
      method: "get",
    }).catch((e) => {
      expect(e).toBeInstanceOf(ScryfallError);
      expect(e.message).toBe(
        "An unexpected error occurred when requesting resources from Scryfall.",
      );
      expect(e.status).toBe(500);
      expect(e.originalError).toBe(err);
    });
  });

  it("provides a Scryfall Error when wrapping response fails", () => {
    expect.assertions(3);

    const err = new Error("something went wrong");

    wrapScryfallResponse.mockImplementation(() => {
      throw err;
    });

    return apiRequest({
      endpoint: "foo",
      method: "get",
    }).catch((e) => {
      expect(e).toBeInstanceOf(ScryfallError);
      expect(e.message).toBe(
        "Something went wrong when wrapping the response from Scryfall",
      );
      expect(e.thrownError).toBe(err);
    });
  });
});
