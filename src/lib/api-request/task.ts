export type TaskFunction<T> = () => T | Promise<T>;

export default class Task<T> {
  taskFn: TaskFunction<T>;
  pendingPromise: Promise<T>;
  resolve?: (res: T) => void;
  reject?: (err: Error) => void;

  constructor(fn: TaskFunction<T>) {
    this.taskFn = fn;
    this.pendingPromise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  getPromise(): Promise<T> {
    return this.pendingPromise;
  }

  start(): Promise<void> {
    return Promise.resolve()
      .then(() => {
        return this.taskFn();
      })
      .then((result) => {
        if (this.resolve) {
          this.resolve(result);
        }
      })
      .catch((err) => {
        if (this.reject) {
          this.reject(err);
        }
      });
  }
}
