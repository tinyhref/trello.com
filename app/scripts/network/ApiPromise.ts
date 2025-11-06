// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';

import { assert, getApiError } from '@trello/error-handling';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { fromNode } from '@trello/promise-helpers';

import { ApiAjax } from 'app/scripts/network/ApiAjax';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ApiPromise = function (args: any) {
  assert(
    !('success' in args) && !('error' in args),
    'This is promise country!',
  );

  return (
    fromNode((next) => ApiAjax(args, next))
      .catch(function (...args1) {
        const [xhr] = Array.from(args1[0]);
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        const apiError = getApiError(xhr.status, xhr.responseText);
        // @ts-expect-error TS(2345): Argument of type '{ status: any; response: any; }'... Remove this comment to see the full error message
        sendNetworkErrorEvent({
          // @ts-expect-error TS(2571): Object is of type 'unknown'.
          status: xhr.status,
          response: apiError.toString(),
        });
        return Bluebird.reject(apiError);
      })
      // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
      .get(0)
  );
};
