import sendRequest from "../../../../src/lib/api-request/send-request";
import ScryfallError from "../../../../src/models/scryfall-error";
import { Mock, vi } from "vitest";
import { getUserAgent } from "../../../../src/lib/api-request/user-agent";

vi.mock("../../../../src/lib/api-request/user-agent");

describe("sendRequest", () => {
  let fetchSpy: Mock;
  let mockResponse: {
    object: string;
    data: Record<string, string>;
    message?: string;
  };

  beforeEach(() => {
    mockResponse = { object: "card", data: {} };

    fetchSpy = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    vi.stubGlobal("fetch", fetchSpy);
  });

  it("sends a get request", async () => {
    await sendRequest({
      method: "get",
      url: "https://example.com",
    });

    expect(fetchSpy).toBeCalledTimes(1);
    expect(fetchSpy).toBeCalledWith("https://example.com", {
      method: "get",
      headers: expect.objectContaining({
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
    });
  });

  it("can send a post request with body", async () => {
    const body = { foo: "bar" };

    await sendRequest({
      method: "post",
      url: "https://example.com",
      body,
    });

    expect(fetchSpy).toBeCalledTimes(1);
    expect(fetchSpy).toBeCalledWith("https://example.com", {
      method: "post",
      headers: expect.objectContaining({
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      body: '{"foo":"bar"}',
    });
  });

  it("automatically sets useragent", async () => {
    vi.mocked(getUserAgent).mockReturnValue("User Agent");

    await sendRequest({
      url: "https://example.com",
    });
    expect(fetchSpy).toBeCalledWith("https://example.com", {
      headers: expect.objectContaining({
        "User-Agent": "User Agent",
      }),
    });
  });

  it("handles scryfall api errors", async () => {
    mockResponse.object = "error";
    mockResponse.message = "Error from API";

    expect.assertions(2);

    await expect(
      sendRequest({
        method: "get",
        url: "https://example.com",
      }),
    ).rejects.toBeInstanceOf(ScryfallError);
    await expect(
      sendRequest({
        method: "get",
        url: "https://example.com",
      }),
    ).rejects.toMatchObject({
      message: "Error from API",
    });
  });
});
