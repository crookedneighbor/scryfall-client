import ExtendedPromise from "@braintree/extended-promise";
export type TaskFunction<T> = () => T | Promise<T>;

export default class Task<T> {
  taskFn: TaskFunction<T>;
  pendingPromise: ExtendedPromise;

  constructor(fn: TaskFunction<T>) {
    this.taskFn = fn;
    this.pendingPromise = new ExtendedPromise();
  }

  getPromise(): Promise<T> {
    return this.pendingPromise
      .then((res: T) => {
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
