// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { addIdleTask } from '@trello/idle-task-scheduler';

const mark = function (name: string) {
  if (process.env.NODE_ENV === 'development') {
    try {
      return performance.mark(`${name}-start`);
    } catch (e) {
      return;
    }
  }
};

const measure = function (name: string) {
  if (process.env.NODE_ENV === 'development') {
    try {
      performance.mark(`${name}-end`);
      return performance.measure(
        `PostRender(${name})`,
        `${name}-start`,
        `${name}-end`,
      );
    } catch (e) {
      return;
    }
  }
};

class PostRender {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _dequeued: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _unnamed: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fxs: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  holding: any;
  constructor() {
    this.holding = false;
    this.fxs = {};
    this._unnamed = 0;
    this._dequeued = {};
  }

  hold() {
    return (this.holding = true);
  }

  // Queued methods need to have a unique name that they are keyed by
  // If the same name is provided multiple times, the callback will get
  // overwritten with the new one, and only called once. If a name is
  // not provided at all, a unique one will be given to it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enqueue(...args: any[]) {
    const adjustedLength = Math.max(args.length, 1);
    let [name] = Array.from(args.slice(0, adjustedLength - 1));
    const fx = args[adjustedLength - 1];
    if (typeof name === 'undefined' || name === null) {
      name = `unnamed_${this._unnamed++}`;
    }

    if (this.holding) {
      this.fxs[name] = () => {
        if (!this._dequeued[name]) {
          mark(name);
          fx();
          return measure(name);
        } else {
          return delete this._dequeued[name];
        }
      };
    } else {
      addIdleTask(() => {
        if (!this._dequeued[name]) {
          mark(name);
          fx();
          return measure(name);
        } else {
          return delete this._dequeued[name];
        }
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dequeue(name: any) {
    this._dequeued[name] = true;
    return delete this.fxs[name];
  }

  release() {
    this.holding = false;

    const fxToRun = this.fxs;
    this.fxs = {};

    for (const name in fxToRun) {
      const fx = fxToRun[name];
      if (!this._dequeued[name]) {
        addIdleTask(fx);
      }
    }
  }
}

const postRender = new PostRender();
export { postRender as PostRender };
