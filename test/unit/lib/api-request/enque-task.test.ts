import enqueTask, { clearQueue } from "Lib/api-request/enque-task";
import Task from "Lib/api-request/task";

describe("enqueTask", () => {
  beforeEach(() => {
    vi.spyOn(Task.prototype, "start");
  });

  afterEach(() => {
    clearQueue();
  });

  it("starts task when it is the first in the queue", async () => {
    const task = vi.fn().mockReturnValue("result");

    const promise = enqueTask(task);
    expect(Task.prototype.start).toBeCalledTimes(1);

    const res = await promise;
    expect(res).toBe("result");
  });

  it("waits to start subsequent tasks with delay until the previous task has finished", async () => {
    expect.assertions(7);

    let resolve;
    const delayedPromise = new Promise((_resolve) => (resolve = _resolve));
    const delayedTask = vi.fn().mockReturnValue(delayedPromise);
    const task = vi.fn().mockReturnValue("result");

    const promise1 = enqueTask(delayedTask);
    const promise2 = enqueTask(task);
    const promise3 = enqueTask(task);

    expect(Task.prototype.start).toBeCalledTimes(1);

    resolve("delayed result");

    const res1 = await promise1;
    expect(res1).toBe("delayed result");

    expect(Task.prototype.start).toBeCalledTimes(1);

    const res2 = await promise2;
    expect(res2).toBe("result");

    expect(Task.prototype.start).toBeCalledTimes(2);

    const res3 = await promise3;
    expect(res3).toBe("result");

    expect(Task.prototype.start).toBeCalledTimes(3);
  });

  // TODO jest fake timers don't play well with promises
  // now that we've moved to vitest, try again!
  // it('TODO: delays between tasks', () => {
  // });
});
