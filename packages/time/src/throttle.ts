/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * Custom throttle function that accepts a function
 * and a minimum milliseconds between invocations
 * implementation based on underscore.js throttle:
 * https://underscorejs.org/docs/modules/throttle.html
 */

export interface ThrottledFunc<T extends (...args: any[]) => any> {
  /**
   * Call the original function, but applying the throttle rules.
   *
   * If the throttled function can be run immediately, this calls it and returns its return
   * value.
   *
   * Otherwise, it returns the return value of the last invocation
   */
  (...args: Parameters<T>): ReturnType<T> | void;

  /**
   * If there an outstanding function call, cancel it
   */
  cancel: () => void;
}

interface Options {
  /** If false, disables execution of the function on the leading edge */
  leading?: boolean;

  /** If false, disables execution of the function on the trailing edge */
  trailing?: boolean;
}

export const throttle = function <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: Options = {},
): ThrottledFunc<T> {
  let lastInvokeTime = 0;
  let timeoutId: number | null;
  let result: ReturnType<T>;
  let context: any;

  const throttledFunction: ThrottledFunc<T> = function (this: any, ...args) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    context = this;

    const time = Date.now();
    if (!lastInvokeTime && options?.leading === false) lastInvokeTime = time;
    const timeSinceLastInvoke = time - lastInvokeTime;

    if (timeSinceLastInvoke > wait) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastInvokeTime = time;
      result = func.apply(context, args);
      context = null;
    } else if (!timeoutId && options?.trailing !== false) {
      timeoutId = window.setTimeout(() => {
        timeoutId = null;
        lastInvokeTime = Date.now();
        result = func.apply(context, args);
        context = null;
      }, wait - timeSinceLastInvoke);
    }

    return result;
  };

  throttledFunction.cancel = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      context = null;
    }
  };

  return throttledFunction;
};
