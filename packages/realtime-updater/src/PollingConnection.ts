import _ from 'underscore';

import { Analytics } from '@trello/atlassian-analytics';
import { clientVersion } from '@trello/config';
import {
  ApiError,
  isFetchCancellationError,
  makeErrorEnum,
} from '@trello/error-handling';
import {
  internetConnectionState,
  verifyAndUpdateInternetHealthUntilHealthy,
} from '@trello/internet-connection-state';
import { RateLimiter } from '@trello/rate-limiter';
import { logConnectionInformation } from '@trello/web-sockets';

import { calculatePollingDelay } from './calculatePollingDelay';
import type { PollingState } from './pollingState';
import { pollingState } from './pollingState';
import type { PollingBatchResponse } from './realtimeUpdater.types';
import { realtimeUpdaterEvents } from './realtimeUpdaterEvents';
import type { Tag } from './SocketConnection.types';
import { subscriptionManager } from './subscriptionManager';
import { syncError } from './syncError';
// eslint-disable-next-line no-restricted-imports
import { trelloBatchFetch } from './trelloBatchFetch';

const realtimeUpdaterError = makeErrorEnum('RPC', ['SyncError']);

const tryParseJson = function (str: string) {
  try {
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
};

const TERMINAL_POLLING_STATES = new Set<NonNullable<PollingState>>([
  'terminating error response',
  'force_disconnected',
  'too_far_behind',
  'rate_limited',
]);

function isInTerminalPollingState() {
  return TERMINAL_POLLING_STATES.has(pollingState.value);
}

const REDBOX_POLLING_STATES = new Set<NonNullable<PollingState>>([
  'rate_limited',
]);

function isRedboxPollingState() {
  return REDBOX_POLLING_STATES.has(pollingState.value);
}

function safelyUpdatePollingState(nextState: PollingState) {
  if (isInTerminalPollingState()) {
    return;
  }

  pollingState.setValue(nextState);
}

const LIMIT_FOR_FAILED_POLLING = 120000;

// Here we use polling instead of a socket, so we have to fake out
// anything that relies on server push (e.g. subscription).
export class PollingConnection {
  _pollingTimeout: number | null = null;
  timeOfFirstFailedPoll: number | null = null;
  totalRateLimiter = new RateLimiter({
    limits: {
      total: {
        value: 1000,
        within: Infinity,
      },
    },
  });
  consecutiveRateLimiter = new RateLimiter({
    limits: {
      consecutive: {
        value: 300,
        within: Infinity,
      },
    },
  });

  subscribe(
    modelType: 'Board' | 'Enterprise' | 'Member' | 'Organization',
    idModel: string,
    tags: Tag[],
    next: (...args: unknown[]) => unknown,
  ) {
    return typeof next === 'function' ? next() : undefined;
  }

  unsubscribe(modelType: string, idModel: string, next?: () => void) {
    return typeof next === 'function' ? next() : undefined;
  }

  stopPolling() {
    safelyUpdatePollingState('disconnected');

    if (this._pollingTimeout !== null) {
      clearTimeout(this._pollingTimeout);
      this._pollingTimeout = null;
    }
  }

  hasExceededMaxFailedPollingTime() {
    const timeSinceFirstFailedPoll =
      this.timeOfFirstFailedPoll === null
        ? 0
        : Date.now() - this.timeOfFirstFailedPoll;

    return timeSinceFirstFailedPoll > LIMIT_FOR_FAILED_POLLING;
  }

  poll() {
    if (this._pollingTimeout) {
      return;
    }

    // Don't poll if we are in a terminal state
    if (isInTerminalPollingState()) {
      return;
    }

    if (this.consecutiveRateLimiter.getTotalCount() === 0) {
      safelyUpdatePollingState('connected');
    }

    this._pollingTimeout = window.setTimeout(
      () => {
        this._pollingTimeout = null;
        this.doPoll();
      },

      calculatePollingDelay(this.consecutiveRateLimiter.getTotalCount()),
    );
  }

  async doPoll() {
    // wait online here so that if subscriptions happen to change when we come back online
    // we are using the most up-to-date values
    if (internetConnectionState.value === 'unhealthy') {
      await verifyAndUpdateInternetHealthUntilHealthy();
    }

    const subscriptions = subscriptionManager.getSubscriptions();
    if (_.isEmpty(subscriptions)) {
      return; // nothing to poll for
    }

    const data = subscriptions.map(
      ({ modelType, idModel, ixLastUpdate, tags }) => ({
        id: idModel,
        url:
          `/${modelType}/${idModel}/deltas` +
          '?ixLastUpdate=' +
          encodeURIComponent(ixLastUpdate.toString()) +
          '&tags=' +
          encodeURIComponent(tags.join(',')),
      }),
    );
    const urls = data.map((item) => item.url);
    const urlToIdHash = new Map<string, string>();
    data.forEach((item) => urlToIdHash.set(item.url, item.id));

    try {
      const response = await trelloBatchFetch<PollingBatchResponse>(urls, {
        operationName: 'pollingFallback',
        headers: {
          'X-Trello-Polling': true,
          'X-Trello-Client-Version': clientVersion,
        },
      });

      for (const [url, error, result] of response) {
        const idModel = urlToIdHash.get(url) as string;
        if (error || !result) {
          subscriptionManager.handleInvalidSubscription(idModel);
          continue;
        }

        if (result.syncError) {
          syncError(realtimeUpdaterError.SyncError(result.syncError), {
            isUsingSocket: false,
            syncErrorAlreadyReported: pollingState.value === 'too_far_behind',
          });

          safelyUpdatePollingState('too_far_behind');

          logConnectionInformation({
            eventName: 'Sync error',
            source: 'pollingConnection',
          });

          this.stopPolling();
          return;
        }

        subscriptionManager.setIxLastUpdate(
          idModel,
          result.modelIxUpdate[idModel],
        );

        _.chain(result.messages || [])
          .map(tryParseJson)
          .compact()
          .forEach(({ notify, idModelChannel }) => {
            realtimeUpdaterEvents.trigger(notify.event, {
              idModelChannel,
              ...notify,
            });
          });
      }

      safelyUpdatePollingState('connected');
      this.consecutiveRateLimiter.reset();
      this.timeOfFirstFailedPoll = null;
      this.poll();
    } catch (err: Error | typeof ApiError) {
      safelyUpdatePollingState('disconnected');

      // if we are offline (which this probably means), then just ignore the failure
      // and rerun the poll
      if (err instanceof Error && isFetchCancellationError(err)) {
        return this.poll();
      }

      if (this.timeOfFirstFailedPoll === null) {
        this.timeOfFirstFailedPoll = Date.now();
      }

      // Increment the request failures so that we can exponentially back off
      // the polling interval. Note the time of the first polling failure so
      // that we can show a redbox if polling fails for over 2 minutes.
      this.totalRateLimiter.addItem();
      this.consecutiveRateLimiter.addItem();

      const errorMessage =
        err instanceof ApiError
          ? err.toString()
          : err instanceof Error
            ? err.message
            : 'Unknown error';

      logConnectionInformation({
        eventName: 'Request error',
        source: 'pollingConnection',
        payload: {
          state: pollingState.value,
          error: errorMessage,
        },
      });

      Analytics.sendOperationalEvent({
        action: 'errored',
        actionSubject: 'polling',
        source: 'network:ajax',
        attributes: {
          error: errorMessage,
        },
      });

      let reason: 'failed polling time exceeded' | 'too many failures' | null =
        null;

      if (
        err instanceof ApiError.Unauthenticated ||
        err instanceof ApiError.RequestBlocked
      ) {
        safelyUpdatePollingState('terminating error response');
      } else if (this.hasExceededMaxFailedPollingTime()) {
        safelyUpdatePollingState('rate_limited');
        reason = 'failed polling time exceeded';
      } else if (
        this.totalRateLimiter.hasReachedLimit('total') ||
        this.consecutiveRateLimiter.hasReachedLimit('consecutive')
      ) {
        safelyUpdatePollingState('rate_limited');
        reason = 'too many failures';
      }

      if (isInTerminalPollingState()) {
        this.stopPolling();

        if (isRedboxPollingState()) {
          Analytics.sendOperationalEvent({
            action: 'errored',
            actionSubject: 'pollingRedbox',
            source: 'network:ajax',
            attributes: {
              reason,
            },
          });
        }

        logConnectionInformation({
          eventName: 'Fatal error',
          source: 'pollingConnection',
          payload: pollingState.value,
        });
        return;
      }

      this.poll();
    }
  }
}
