import Task, { TaskFunction } from "./task";

const DEFAULT_SCRYFALL_DESIGNATED_WAIT_TIME = 100;

let taskCurrentlyInProgress = false;
let queue: Task[] = [];
let delayTime = DEFAULT_SCRYFALL_DESIGNATED_WAIT_TIME;

export function clearQueue(): void {
  queue = [];
  taskCurrentlyInProgress = false;
}

function delayForScryfallDesignatedTime(): Promise<void> {
  return new Promise(function (resolve) {
    setTimeout(resolve, delayTime);
  });
}

export function setTaskDelayTime(time: number): void {
  delayTime = time;
}

export function resetTaskDelayTime(): void {
  delayTime = DEFAULT_SCRYFALL_DESIGNATED_WAIT_TIME;
}

function checkForEnquedTasks(recursiveCheck?: boolean): void {
  if (queue.length > 0) {
    const nextTask = queue.shift();

    if (!nextTask) {
      taskCurrentlyInProgress = false;
      return;
    }

    delayForScryfallDesignatedTime().then(() => {
      taskCurrentlyInProgress = true;

      nextTask.start().then(() => {
        checkForEnquedTasks();
      });
    });
  } else if (recursiveCheck) {
    taskCurrentlyInProgress = false;
  } else {
    delayForScryfallDesignatedTime().then(() => {
      checkForEnquedTasks(true);
    });
  }
}

export default function enqueTask(
  task: TaskFunction<unknown>
): Promise<unknown> {
  const handler = new Task(task);

  if (!taskCurrentlyInProgress) {
    taskCurrentlyInProgress = true;

    handler.start().then(() => {
      checkForEnquedTasks();
    });
  } else {
    queue.push(handler);
  }

  return handler.getPromise();
}
