import { get, post } from "../../../../src/lib/api-request";
import sendApiRequest from "../../../../src/lib/api-request/send-request-to-api";

vi.mock("../../../../src/lib/api-request/send-request-to-api");

describe("request", () => {
  beforeEach(() => {
    sendApiRequest.mockResolvedValue({});
  });

  describe("get", () => {
    it("makes an api get request", () => {
      return get("foo").then(() => {
        expect(sendApiRequest).toBeCalledTimes(1);
        expect(sendApiRequest).toBeCalledWith(
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
        expect(sendApiRequest).toBeCalledTimes(1);
        expect(sendApiRequest).toBeCalledWith(
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
        expect(sendApiRequest).toBeCalledTimes(1);
        expect(sendApiRequest).toBeCalledWith(
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
        expect(sendApiRequest).toBeCalledTimes(1);
        expect(sendApiRequest).toBeCalledWith(
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
