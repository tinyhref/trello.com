/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * Custom throttle function that accepts a function that only
 * invokes the action at most once per requested animation frame.
 */
import type { ThrottledFunc } from './throttle';

export const throttleOnAnimationFrame = function <
  T extends (...args: any[]) => any,
>(func: T): ThrottledFunc<T> {
  let handle = -1;
  let newestArgs: any[];

  // calls func with the most recent args and original context
  const update = (context: any) => () => {
    handle = -1;
    func.apply(context, newestArgs);
  };

  const throttledFunction: ThrottledFunc<T> = function (this: any, ...args) {
    newestArgs = args;

    // if handle is set, we're still waiting for a frame
    if (handle === -1) {
      handle = requestAnimationFrame(update(this));
    }
  };

  throttledFunction.cancel = function () {
    cancelAnimationFrame(handle);
    handle = -1;
  };

  return throttledFunction;
};
