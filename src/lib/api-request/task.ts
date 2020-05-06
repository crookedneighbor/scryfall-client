import * as ExtendedPromise from "@braintree/extended-promise";
export type TaskFunction<T> = () => T | Promise<T>;
export type TaskPromise = Promise<unknown>;

export default class Task {
  taskFn: TaskFunction<unknown>;
  pendingPromise: ExtendedPromise;

  constructor(fn: TaskFunction<unknown>) {
    this.taskFn = fn;
    this.pendingPromise = new ExtendedPromise();
  }

  getPromise(): Promise<unknown> {
    return this.pendingPromise
      .then((res: unknown) => {
        return Promise.resolve(res);
      })
      .catch((e: Error) => {
        return Promise.reject(e);
      });
  }

  start(): Promise<void> {
    return Promise.resolve()
      .then(() => {
        return this.taskFn();
      })
      .then((result) => {
        this.pendingPromise.resolve(result);
      })
      .catch((err) => {
        this.pendingPromise.reject(err);
      });
  }
}
