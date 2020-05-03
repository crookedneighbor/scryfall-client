import * as ExtendedPromise from "@braintree/extended-promise";
export type TaskFunction<T> = () => T | Promise<T>;
export type TaskPromise = ExtendedPromise;

export default class Task {
  taskFn: TaskFunction<unknown>;
  pendingPromise: ExtendedPromise;

  constructor(fn: TaskFunction<unknown>) {
    this.taskFn = fn;
    this.pendingPromise = new ExtendedPromise();
  }

  getPromise(): ExtendedPromise {
    return this.pendingPromise;
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
