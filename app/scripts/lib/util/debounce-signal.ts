// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import Hearsay from 'hearsay';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounceSignal = (signal: any, delay: any) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new Hearsay.ContinuousSignal(function (send: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let unsubscribe: any;
    let lastValue = signal.get();
    let lastSend = Date.now();
    send(lastValue);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let nextUpdate: any = null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendNewValue = function (latest: any) {
      lastValue = latest;
      lastSend = Date.now();
      return send(latest);
    };

    if (delay > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      unsubscribe = signal.subscribe(function (latest: any) {
        clearTimeout(nextUpdate);
        // don't send same value twice in a row
        if (lastValue === latest) {
          return;
        }
        const remainingWait = delay - (Date.now() - lastSend);
        if (remainingWait <= 0) {
          return sendNewValue(latest);
        } else {
          return (nextUpdate = setTimeout(
            () => sendNewValue(latest),
            remainingWait,
          ));
        }
      });

      return function () {
        unsubscribe();
        return clearTimeout(nextUpdate);
      };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      unsubscribe = signal.subscribe(function (latest: any) {
        cancelAnimationFrame(nextUpdate);
        return (nextUpdate = requestAnimationFrame(() => send(latest)));
      });

      return function () {
        unsubscribe();
        return cancelAnimationFrame(nextUpdate);
      };
    }
  });
