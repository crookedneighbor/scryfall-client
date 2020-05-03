import { TaskFunction } from "../task";

export default jest.fn((fn: TaskFunction<unknown>) => {
  return Promise.resolve().then(() => {
    return fn();
  });
});
