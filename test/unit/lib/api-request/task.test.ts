import Task from "../../../../src/lib/api-request/task";

describe("Task", () => {
  describe("getPromise", () => {
    it("returns the extended promise", () => {
      const t = new Task(() => {
        return "foo";
      });

      expect.assertions(1);

      const promise = t.getPromise().then((result) => {
        expect(result).toBe("foo");
      });

      t.start();

      return promise;
    });
  });

  describe("start", () => {
    it("runs a function that returns a promise", async () => {
      const spy = vi.fn().mockResolvedValue("foo");
      const t = new Task(spy);

      expect.assertions(2);

      await t.start();

      expect(spy).toBeCalledTimes(1);

      const result = await t.getPromise();

      expect(result).toBe("foo");
    });

    it("rejects the pending promise if function rejects", async () => {
      const err = new Error("some error");
      const spy = vi.fn().mockRejectedValue(err);
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
      const spy = vi.fn().mockImplementation(() => {
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
