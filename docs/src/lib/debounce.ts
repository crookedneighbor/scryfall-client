type Callback = () => void;
type EventCallback = (event: KeyboardEvent | MouseEvent) => void;

export default function debounce(cb: Callback, time = 1000): EventCallback {
  let wait = false;

  return function (event: KeyboardEvent | MouseEvent): void {
    if (wait) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const val = input.value;

    wait = true;

    cb();

    setTimeout(function (): void {
      if (val !== input.value) {
        cb();
      }
      wait = false;
    }, time);
  };
}
