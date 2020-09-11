import ExtendedPromise from "@braintree/extended-promise";
import enqueTask, { clearQueue } from "Lib/api-request/enque-task";
import Task from "Lib/api-request/task";

describe("enqueTask", () => {
  beforeEach(() => {
    jest.spyOn(Task.prototype, "start");
  });

  afterEach(() => {
    clearQueue();
  });

  it("starts task when it is the first in the queue", async () => {
    const task = jest.fn().mockReturnValue("result");

    const promise = enqueTask(task);
    expect(Task.prototype.start).toBeCalledTimes(1);

    const res = await promise;
    expect(res).toBe("result");
  });

  it("waits to start subsequent tasks with delay until the previous task has finished", async () => {
    expect.assertions(7);

    const delayedPromise = new ExtendedPromise();
    const delayedTask = jest.fn().mockReturnValue(delayedPromise);
    const task = jest.fn().mockReturnValue("result");

    const promise1 = enqueTask(delayedTask);
    const promise2 = enqueTask(task);
    const promise3 = enqueTask(task);

    expect(Task.prototype.start).toBeCalledTimes(1);

    delayedPromise.resolve("delayed result");

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
  // it('TODO: delays between tasks', () => {
  // });
});
