/*
 * Custom interval function that accepts a function
 * and a minimum milliseconds between invocations
 * to apply changes during an animationframe
 */
interface IntervalFunc {
  /**
   * Call the original function, close to the given interval,
   * by requesting animation frames.
   */
  (): void;

  /**
   * If there is an outstanding function call, clear it
   */
  clear: () => void;
}

export const setIntervalOnAnimationFrame = function (
  func: () => void,
  minDelay: number,
): IntervalFunc {
  let start = Date.now();
  let handle = -1;

  const intervalFunction: IntervalFunc = () => {
    if (handle < 0) {
      return;
    }

    if (Date.now() - start >= minDelay) {
      start += minDelay;
      func();
    }

    handle = requestAnimationFrame(intervalFunction);
  };

  intervalFunction.clear = () => {
    cancelAnimationFrame(handle);
    handle = -1;
  };

  handle = requestAnimationFrame(intervalFunction);

  return intervalFunction;
};
