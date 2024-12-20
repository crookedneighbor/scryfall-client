import {
  setUserAgent,
  getUserAgent,
  resetUserAgent,
} from "../../../../src/lib/api-request/user-agent";

describe("user-agent", () => {
  afterEach(() => {
    resetUserAgent();
  });

  it('defaults user agent to ""', () => {
    expect(getUserAgent()).toEqual("");
  });

  it("can set user agent", () => {
    setUserAgent("foo");
    expect(getUserAgent()).toEqual("foo");
  });
});
