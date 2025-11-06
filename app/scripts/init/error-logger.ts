// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { ApiError } from '@trello/error-handling';
import { sendCrashEvent, sendErrorEvent } from '@trello/error-reporting';
import { NetworkError } from '@trello/graphql-error-handling';

import { errorSignal } from 'app/scripts/lib/error-signal';
import { scrubUrl } from 'app/src/scrubUrl';

// TODO: We don't think this crashes the user session but we'll need to verify.
// This covers 'ResizeObserver loop limit exceeded.' and 'ResizeObserver loop completed with undelivered notifications.'
// See: https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
const knownErrors = ['ResizeObserver loop'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isInterestingError = (err: any) =>
  err instanceof ApiError.Other || !(err instanceof ApiError);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isKnownNotToCrash = (err: any) =>
  knownErrors.some((msg) => err?.message?.includes(msg));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hasTraceId = (err: any) => 'traceId' in err;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pastErrors: any = [];

errorSignal.subscribe(
  _.debounce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function (errorInfo: any) {
      // We want to avoid a situation where a client gets into an infinite error
      // loop and spams us over and over, and our deduplicator fails to detect that.
      if (pastErrors.length === 10) {
        return false;
      }

      const { error, url, line, col } = errorInfo;

      // Failed network requests are passed to `sendNetworkErrrorEvent` before
      // being thrown, so we exclude them here.
      if (error instanceof NetworkError) {
        return false;
      }

      if (!isInterestingError(error)) {
        if (!hasTraceId(error)) {
          return false;
        }
      }

      // We only care if it's one of our scripts that's having an error.
      // We don't care if it's an extension (or script related to an extension)
      if (
        !new RegExp(
          `https?://(${location.host}|[a-z0-9]+\\.cloudfront\\.net|a(?:-staging)?.trellocdn.com)/`,
        ).test(url)
      ) {
        return false;
      }

      const errorEntry = [error.message, url, line, col];

      if (_.any(pastErrors, (entry) => _.isEqual(errorEntry, entry))) {
        return false;
      }

      const extraData = {
        // If the script URL was not provided, we default to location.href. In
        // that case, scrub board / card names away
        url: url === document.location.href ? scrubUrl(url) : url,
        line,
        col,
      };

      // Use sendErrorEvent for new traced errors that are now being sent
      if (isInterestingError(error)) {
        if (isKnownNotToCrash(error)) {
          return sendErrorEvent(
            error,
            {
              extraData,
            },
            false,
          );
        } else {
          sendCrashEvent(error, {
            extraData,
          });
        }
      }

      pastErrors.push(errorEntry);
      return false;
    },
    1000,
    true,
  ),
);
