import ScryfallError from "Models/scryfall-error";
import Task, { TaskFunction, TaskPromise } from "./task";

const DEFAULT_SCRYFALL_DESIGNATED_WAIT_TIME = 100;

let taskCurrentlyInProgress = false;
let queue: Task[] = [];

export function clearQueue(): void {
  queue = [];
  taskCurrentlyInProgress = false;
}

function delayForScryfallDesignatedTime(
  waitTime = DEFAULT_SCRYFALL_DESIGNATED_WAIT_TIME
) {
  return new Promise(function (resolve) {
    setTimeout(resolve, waitTime);
  });
}

function checkForEnquedTasks(recursiveCheck?: boolean) {
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

export default function enqueTask(task: TaskFunction<unknown>): TaskPromise {
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
