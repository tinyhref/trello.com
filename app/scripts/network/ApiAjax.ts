/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'prom... Remove this comment to see the full error message
import Queue from 'promise-queue';

import { Analytics } from '@trello/atlassian-analytics';
import { getInvitationTokens } from '@trello/invitation-tokens/getInvitationTokens';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { ModelCache } from 'app/scripts/db/ModelCache';
import { ajaxQueue } from 'app/scripts/network/ajaxQueue';
import { methodOf } from './methodOf';

const queue = new Queue(3);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const performAjax = function (opts: any) {
  if (opts.data == null) {
    opts.data = {};
  }

  // The API requires two forms of authentication (cookie + body) for non-GET
  // requests (to mitigate CSRF attacks), but does not require them for GETs.
  if (methodOf(opts) !== 'GET') {
    const csrfPayload = getCsrfRequestPayload();
    opts.data.dsc = csrfPayload.dsc;
  }

  // But it always expects invitationTokens to be there. This is expected to
  // change in the future, so that this is consistent with token. When that
  // happens, you know what to do.
  if (!opts.suppressInvitationTokens) {
    if (opts.data.invitationTokens == null) {
      opts.data.invitationTokens = getInvitationTokens();
    }
  }

  // If it is flagged as a background operation that the user did not start,
  // then we do not want to warn about slow sending or break on possible
  // failures.
  if (opts.background) {
    ajaxQueue.send(opts);
    return;
  }

  if (opts.modelCache == null) {
    opts.modelCache = ModelCache;
  }
  ajaxQueue.ajax(opts);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ApiAjax = (opts: any, next?: any) =>
  queue
    .add(function () {
      const customSuccess = opts.success;
      const customError = opts.error;

      if (opts.headers == null) {
        opts.headers = {};
      }

      const traceId = opts.traceId;
      if (traceId) {
        opts.headers = {
          ...opts.headers,
          ...Analytics.getTaskRequestHeaders(traceId),
        };
      }

      return new Bluebird(function (resolve, reject) {
        opts = {
          ...opts,

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          success(...args: any[]) {
            if (traceId && args && Array.isArray(args)) {
              const xhr = args[args.length - 1];
              if (xhr?.getResponseHeader?.('X-Trello-Version')) {
                const trelloServerVersion =
                  xhr.getResponseHeader('X-Trello-Version');
                Analytics.setTrelloServerVersion(traceId, trelloServerVersion);
              }
            }
            if (typeof customSuccess === 'function') {
              customSuccess(...Array.from(args || []));
            }
            resolve(args);
          },

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error(res: any, textStatus: any, error: any, fxDefault: any) {
            const trelloServerVersion =
              res.getResponseHeader('X-Trello-Version');
            Analytics.setTrelloServerVersion(traceId, trelloServerVersion);
            if (customError != null) {
              customError(res, textStatus, error, fxDefault);
            }
            reject([res, textStatus, error, fxDefault]);
          },
        };
        performAjax(opts);
      });
    })
    .nodeify(next)
    .catch(function () {});
