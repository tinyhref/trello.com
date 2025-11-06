/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
import Hearsay from 'hearsay';

import { bifrostTrack, clientVersion } from '@trello/config';
import { assert } from '@trello/error-handling';

const errorSignal = new Hearsay.Emitter();
errorSignal.use();

class ErrorInfo {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  col: any;
  error: Error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  line: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  url: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(error: Error, url: any, line: any, col: any) {
    this.error = error;
    if (url == null) {
      url = document.location.href;
    }
    this.url = url;
    if (line == null) {
      line = 0;
    }
    this.line = line;
    if (col == null) {
      col = 0;
    }
    this.col = col;
    assert(this.error != null);
  }
}

window.onerror = function (msg, url, line, col, error) {
  if (error == null) {
    // @ts-expect-error TS(2769): No overload matches this call.
    error = new Error(msg);
  }
  return errorSignal.send(new ErrorInfo(error, url, line, col));
};

Bluebird.onPossiblyUnhandledRejection(function (error) {
  // Make sure this lands in the browser console if the
  // member is not on the main track or are running locally
  const shouldPrintRejection =
    bifrostTrack !== 'main' || clientVersion === 'dev-0';

  if (shouldPrintRejection) {
    if (typeof console !== 'undefined' && console !== null) {
      console.warn('Possibly Unhandled Rejection:', error.message);
    }
    if (typeof console !== 'undefined' && console !== null) {
      console.error(error.stack);
    }
  }

  // @ts-expect-error TS(2554): Expected 4 arguments, but got 1.
  return errorSignal.send(new ErrorInfo(error));
});

export { errorSignal };
