import Task from "Lib/api-request/task";
import * as ExtendedPromise from "@braintree/extended-promise";

describe("Task", () => {
  it("takes a function", () => {
    const t = new Task(() => {
      return "foo";
    });
  });

  describe("getPromise", () => {
    it("returns the extended promise", () => {
      const t = new Task(() => {
        return "foo";
      });

      expect.assertions(1);

      const promise = t.getPromise().then((result: string) => {
        expect(result).toBe("foo");
      });

      t.start();

      return promise;
    });
  });

  describe("start", () => {
    it("runs a function that returns a promise", async () => {
      const spy = jest.fn().mockResolvedValue("foo");
      const t = new Task(spy);

      expect.assertions(2);

      await t.start();

      expect(spy).toBeCalledTimes(1);

      const result = await t.getPromise();

      expect(result).toBe("foo");
    });

    it("runs a function that returns a promise", async () => {
      const spy = jest.fn().mockReturnValue("foo");
      const t = new Task(spy);

      expect.assertions(2);

      await t.start();

      expect(spy).toBeCalledTimes(1);

      const result = await t.getPromise();

      expect(result).toBe("foo");
    });

    it("rejects the pending promise if function rejects", async () => {
      const err = new Error("some error");
      const spy = jest.fn().mockRejectedValue(err);
      const t = new Task(spy);

      expect.assertions(2);

      await t.start();

      expect(spy).toBeCalledTimes(1);

      try {
        await t.getPromise();
      } catch (e) {
        expect(e).toBe(err);
      }
    });

    it("rejects the pending promise if function throws an error", async () => {
      const err = new Error("some error");
      const spy = jest.fn().mockImplementation(() => {
        throw err;
      });
      const t = new Task(spy);

      expect.assertions(2);

      await t.start();

      expect(spy).toBeCalledTimes(1);

      try {
        await t.getPromise();
      } catch (e) {
        expect(e).toBe(err);
      }
    });
  });
});
