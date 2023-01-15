import { TaskFunction } from "../task";

export default vi.fn((fn: TaskFunction<unknown>) => {
  return Promise.resolve().then(() => {
    return fn();
  });
});
