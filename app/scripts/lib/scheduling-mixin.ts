/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

export const SchedulingMixin = {
  setTimeout(fn: () => void, interval: number) {
    let idTimeout;
    // @ts-expect-error TS(2339): Property '_scheduled_timeouts' does not exist on t... Remove this comment to see the full error message
    if (this._scheduled_timeouts == null) {
      // @ts-expect-error TS(2339): Property '_scheduled_timeouts' does not exist on t... Remove this comment to see the full error message
      this._scheduled_timeouts = [];
    }
    // @ts-expect-error TS(2339): Property '_scheduled_timeouts' does not exist on t... Remove this comment to see the full error message
    this._scheduled_timeouts.push((idTimeout = setTimeout(fn, interval)));
    return idTimeout;
  },

  setInterval(fn: () => void, interval: number) {
    let idInterval;
    // @ts-expect-error TS(2339): Property '_scheduled_intervals' does not exist on ... Remove this comment to see the full error message
    if (this._scheduled_intervals == null) {
      // @ts-expect-error TS(2339): Property '_scheduled_intervals' does not exist on ... Remove this comment to see the full error message
      this._scheduled_intervals = [];
    }
    // @ts-expect-error TS(2339): Property '_scheduled_intervals' does not exist on ... Remove this comment to see the full error message
    this._scheduled_intervals.push((idInterval = setInterval(fn, interval)));
    return idInterval;
  },

  requestAnimationFrame(fn: FrameRequestCallback) {
    let idRequest;
    // @ts-expect-error TS(2339): Property '_scheduled_frameRequests' does not exist... Remove this comment to see the full error message
    if (this._scheduled_frameRequests == null) {
      // @ts-expect-error TS(2339): Property '_scheduled_frameRequests' does not exist... Remove this comment to see the full error message
      this._scheduled_frameRequests = [];
    }
    // @ts-expect-error TS(2339): Property '_scheduled_frameRequests' does not exist... Remove this comment to see the full error message
    this._scheduled_frameRequests.push((idRequest = requestAnimationFrame(fn)));
    return idRequest;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback(fn: any) {
    const callbacks =
      // @ts-expect-error TS(2339): Property '_scheduled_callbacks' does not exist on ... Remove this comment to see the full error message
      this._scheduled_callbacks != null
        ? // @ts-expect-error TS(2339): Property '_scheduled_callbacks' does not exist on ... Remove this comment to see the full error message
          this._scheduled_callbacks
        : // @ts-expect-error TS(2339): Property '_scheduled_callbacks' does not exist on ... Remove this comment to see the full error message
          (this._scheduled_callbacks = []);
    // @ts-expect-error TS(2339): Property '_scheduled_callbacks' does not exist on ... Remove this comment to see the full error message
    this._scheduled_callbacks.push(fn);
    // A version of the callback that only runs if cancelScheduled hasn't
    // been called
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (this: any, ...args: any[]) {
      const index = callbacks.indexOf(fn);
      if (index !== -1) {
        callbacks.splice(index, 1);
        return fn.apply(this, args);
      } else {
        return;
      }
    };
  },

  cancelScheduled() {
    // @ts-expect-error TS(2339): Property '_scheduled_callbacks' does not exist on ... Remove this comment to see the full error message
    if (this._scheduled_callbacks != null) {
      // @ts-expect-error TS(2339): Property '_scheduled_callbacks' does not exist on ... Remove this comment to see the full error message
      while (this._scheduled_callbacks.length) {
        // @ts-expect-error TS(2339): Property '_scheduled_callbacks' does not exist on ... Remove this comment to see the full error message
        this._scheduled_callbacks.pop();
      }
    }

    // @ts-expect-error TS(2339): Property '_scheduled_intervals' does not exist on ... Remove this comment to see the full error message
    if (this._scheduled_intervals != null) {
      // @ts-expect-error TS(2339): Property '_scheduled_intervals' does not exist on ... Remove this comment to see the full error message
      for (const interval of Array.from(this._scheduled_intervals)) {
        // @ts-expect-error TS(2769): No overload matches this call.
        clearInterval(interval);
      }
    }

    // @ts-expect-error TS(2339): Property '_scheduled_timeouts' does not exist on t... Remove this comment to see the full error message
    if (this._scheduled_timeouts != null) {
      // @ts-expect-error TS(2339): Property '_scheduled_timeouts' does not exist on t... Remove this comment to see the full error message
      for (const timeout of Array.from(this._scheduled_timeouts)) {
        // @ts-expect-error TS(2769): No overload matches this call.
        clearTimeout(timeout);
      }
    }

    // @ts-expect-error TS(2339): Property '_scheduled_frameRequests' does not exist... Remove this comment to see the full error message
    if (this._scheduled_frameRequests != null) {
      for (const frameRequest of Array.from(
        // @ts-expect-error TS(2339): Property '_scheduled_frameRequests' does not exist... Remove this comment to see the full error message
        this._scheduled_frameRequests != null
          ? // @ts-expect-error TS(2339): Property '_scheduled_frameRequests' does not exist... Remove this comment to see the full error message
            this._scheduled_frameRequests
          : [],
      )) {
        // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
        cancelAnimationFrame(frameRequest);
      }
    }
  },

  defer(fn: () => void) {
    return this.setTimeout(fn, 1);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debounce(fn: any, wait: number) {
    if (wait == null) {
      wait = 1;
    }
    return this.dynamicDebounce(fn, () => wait);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dynamicDebounce(fn: any, getInterval: any) {
    const setTimeout = this.setTimeout.bind(this);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timeout: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (this: any) {
      const args = arguments;
      const later = () => {
        timeout = null;
        fn.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, getInterval.apply(this, args));
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callOnceAfter(fn: any, wait: any) {
    if (wait == null) {
      wait = 1;
    }
    const setTimeout = this.setTimeout.bind(this);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timeout: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (this: any) {
      if (timeout) {
        return;
      }
      const args = arguments;
      const later = () => {
        timeout = null;
        fn.apply(this, args);
      };
      timeout = setTimeout(later, wait);
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  throttle(func: any, wait: any, options: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let args: any, result: any, timeout: any;
    if (options == null) {
      options = {};
    }
    let context = (args = result = timeout = null);
    const leading = options.leading != null ? options.leading : true;
    const trailing = options.trailing != null ? options.trailing : true;

    const setTimeout = this.setTimeout.bind(this);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let previous: any = null;
    const later = function () {
      previous = leading ? _.now() : 0;
      timeout = null;
      result = func.apply(context, args);
      return (context = args = null);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (this: any) {
      const now = _.now();
      if (previous == null && !leading) {
        previous = now;
      }

      const remaining = wait - (now - previous);
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && trailing) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  },
};
