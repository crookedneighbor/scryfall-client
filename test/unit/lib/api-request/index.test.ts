import { get, post } from "Lib/api-request";
import sendApiRequest from "Lib/api-request/send-request-to-api";

import { mocked } from "ts-jest/utils";

jest.mock("Lib/api-request/send-request-to-api");

describe("request", () => {
  let requestSpy: jest.SpyInstance;

  beforeEach(() => {
    requestSpy = mocked(sendApiRequest);
  });

  afterEach(() => {
    requestSpy.mockClear();
  });

  describe("get", () => {
    it("makes an api get request", () => {
      return get("foo").then(() => {
        expect(requestSpy).toBeCalledTimes(1);
        expect(requestSpy).toBeCalledWith(
          expect.objectContaining({
            endpoint: "foo",
            method: "get",
          })
        );
      });
    });

    it("makes an api get request with query params", () => {
      return get("foo", {
        q: "bar",
      }).then(() => {
        expect(requestSpy).toBeCalledTimes(1);
        expect(requestSpy).toBeCalledWith(
          expect.objectContaining({
            endpoint: "foo",
            method: "get",
            query: {
              q: "bar",
            },
          })
        );
      });
    });
  });

  describe("post", () => {
    it("makes an api post request", () => {
      return post("foo").then(() => {
        expect(requestSpy).toBeCalledTimes(1);
        expect(requestSpy).toBeCalledWith(
          expect.objectContaining({
            endpoint: "foo",
            method: "post",
          })
        );
      });
    });

    it("makes an api post request with post body", () => {
      return post("foo", {
        post: "bar",
      }).then(() => {
        expect(requestSpy).toBeCalledTimes(1);
        expect(requestSpy).toBeCalledWith(
          expect.objectContaining({
            endpoint: "foo",
            method: "post",
            body: {
              post: "bar",
            },
          })
        );
      });
    });
  });
});
