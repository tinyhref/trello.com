import { Analytics } from '@trello/atlassian-analytics';
import { isMemberLoggedIn } from '@trello/authentication';
import {
  browserStr,
  isAndroid,
  isDesktop,
  isEmbeddedInMSTeams,
  isIos,
  osStr,
} from '@trello/browser';
import { clientVersion } from '@trello/config';
import { Deferred } from '@trello/deferred';
import { dynamicConfigClient } from '@trello/dynamic-config';
import {
  internetConnectionState,
  verifyAndUpdateInternetHealthUntilHealthy,
} from '@trello/internet-connection-state';
import { monitor, monitorEvents, monitorStatus } from '@trello/monitor';
import { fromNode } from '@trello/promise-helpers';
import { RateLimiter } from '@trello/rate-limiter';
import {
  calculateBackOffRange,
  getBackOffDelay,
} from '@trello/reconnect-back-off';
import { getMilliseconds } from '@trello/time';
import {
  isValidReconnectionState,
  logConnectionInformation,
  safelyUpdateWebSocketState,
  webSocketState,
} from '@trello/web-sockets';

import { connectionConfig } from './connectionConfig';
import { createSocketConnection } from './createSocketConnection';
import { getWebSocketUrl } from './getWebSocketUrl';
import { isCloseEvent } from './isCloseEvent';
import { PollingConnection } from './PollingConnection';
import { realtimeUpdaterEvents } from './realtimeUpdaterEvents';
import type {
  ClientCodeValue,
  ServerCodeValue,
  Tag,
} from './SocketConnection.types';
import { ClientCode, ServerCode } from './SocketConnection.types';
import {
  connectionFailed,
  connectionSucceeded,
  startSocketConnectionTransaction,
} from './socketConnectionTransaction';
import { subscriptionManager } from './subscriptionManager';

const INVALID_MODEL_ERRORS = ['unauthorized', 'forbidden', 'not found'];

type SocketConnection = ReturnType<typeof createSocketConnection>;
type PollingConnectionInstance = InstanceType<typeof PollingConnection>;
type RealtimeConnectionInstance<
  T extends PollingConnectionInstance | SocketConnection,
> = T;

const codeToReasonMap: Record<
  ClientCodeValue | ServerCodeValue | number,
  keyof typeof ClientCode | keyof typeof ServerCode
> = {
  [ServerCode.TerminatedSession]: 'TerminatedSession',
  [ServerCode.DisableReconnect]: 'DisableReconnect',
  [ServerCode.Abnormal]: 'Abnormal',
  [ServerCode.DataTooLarge]: 'DataTooLarge',
  [ServerCode.InconsistentData]: 'InconsistentData',
  [ServerCode.InvalidData]: 'InvalidData',
  [ServerCode.ProtocolError]: 'ProtocolError',
  [ServerCode.DelayReconnect]: 'DelayReconnect',
  [ServerCode.Normal]: 'Normal',
  [ServerCode.PolicyViolation]: 'PolicyViolation',
  [ServerCode.GoingAway]: 'GoingAway',
  [ServerCode.ServerRestart]: 'ServerRestart',
  [ServerCode.BadGateway]: 'BadGateway',
  [ServerCode.ClosedNoStatus]: 'ClosedNoStatus',
  [ServerCode.MandatoryExtension]: 'MandatoryExtension',
  [ServerCode.Reserved]: 'Reserved',
  [ServerCode.ServerError]: 'ServerError',
  [ServerCode.TryAgainLater]: 'TryAgainLater',
  [ServerCode.TLSHandshakeFailed]: 'TLSHandshakeFailed',
  [ClientCode.InternetUnhealthy]: 'InternetUnhealthy',
  [ClientCode.ResyncError]: 'ResyncError',
  [ClientCode.ConnectionAcknowledgementTimeout]:
    'ConnectionAcknowledgementTimeout',
  [ClientCode.ConnectionAcknowledgementError]: 'ConnectionAcknowledgementError',
  [ClientCode.ConnectionInitiationTimeout]: 'ConnectionInitiationTimeout',
  [ClientCode.ErrorSendingMessage]: 'ErrorSendingMessage',
  [ClientCode.MessageTimeout]: 'MessageTimeout',
  [ClientCode.PingTimeout]: 'PingTimeout',
  [ClientCode.SubscriptionError]: 'SubscriptionError',
};

type ErrorTypes = NonNullable<
  (typeof codeToReasonMap)[ClientCodeValue | ServerCodeValue]
>;

type FailedReason =
  | ErrorTypes
  | 'error'
  | 'Range_0_999'
  | 'Range_1000_2999'
  | 'Range_3000_3999'
  | 'Range_4000_4999'
  | 'ServerPingTimeout'
  | 'unknown';

function getFailedReasonFromCloseEvent(closeEvent: CloseEvent): FailedReason {
  const failedReason = codeToReasonMap[closeEvent.code];
  if (failedReason) {
    if (
      failedReason === 'ServerError' &&
      closeEvent.reason === 'Ping timeout'
    ) {
      return 'ServerPingTimeout';
    }
    return failedReason;
  } else {
    if (closeEvent.code >= 0 && closeEvent.code <= 999) {
      return 'Range_0_999';
    } else if (closeEvent.code >= 1000 && closeEvent.code <= 2999) {
      return 'Range_1000_2999';
    } else if (closeEvent.code >= 3000 && closeEvent.code <= 3999) {
      return 'Range_3000_3999';
    } else if (closeEvent.code >= 4000 && closeEvent.code <= 4999) {
      return 'Range_4000_4999';
    } else {
      return 'unknown';
    }
  }
}

function isFastFailure({
  startedAt,
  failedAt,
}: {
  startedAt: number;
  failedAt: number;
}) {
  return failedAt - startedAt < 20;
}

const POSSIBLY_UNHEALTHY_INTERNET_FAILURES = new Set<FailedReason>([
  'InternetUnhealthy',
  'MessageTimeout',
  'PingTimeout',
  'Abnormal',
  'error',
]);
const isPossiblyUnhealthyInternetFailure = (failure: FailedReason) =>
  POSSIBLY_UNHEALTHY_INTERNET_FAILURES.has(failure);

/**
 * List of failures that could be considered dangerous in that they signal an issue
 * with server. In these cases, we likely want to give fast reconnection backoff delays
 * to protect server from too many requests.
 */
const POSSIBLY_DANGEROUS_FAILURES = new Set<FailedReason>([
  // We received { type: 'ping', error: Anything } from server
  'ConnectionAcknowledgementError',
  // We didn't receive a response to the ack message
  'ConnectionAcknowledgementTimeout',
  // The connection never opened
  'ConnectionInitiationTimeout',
  // Generic error
  'error',
]);
const isPossiblyDangerousFailure = (failure: FailedReason) =>
  POSSIBLY_DANGEROUS_FAILURES.has(failure);

/**
 * List of failures that we can confidently say are emblematic of a
 * server incident.
 */
const SERVER_INCIDENT_FAILURES = new Set<FailedReason>([
  // We received { type: 'ping', error: Anything } from server
  'ConnectionAcknowledgementError',
  // We didn't receive a response to the ack message
  'ConnectionAcknowledgementTimeout',
  // The connection never opened
  'ConnectionInitiationTimeout',
]);
const isServerIncidentFailure = (failure: FailedReason) =>
  SERVER_INCIDENT_FAILURES.has(failure);

function getNumConsecutiveFailures(
  failedReasons: FailedReason[],
  reason: FailedReason,
) {
  let count = 0;
  for (let i = 1; i <= failedReasons.length; i++) {
    if (failedReasons[i] !== reason) {
      return count;
    }

    count++;
  }

  return count;
}

/**
 * If a user is logged in when the RealtimeUpdaterClient is constructed, we will attempt to establish a socket
 * connection immediately, and maintain the connection for the duration of the session. If the user is not logged in,
 * the connection will be established the first time an attempt is made to subscribe to a model.
 *
 * If the initial connection cannot be established, the user will instead poll for updates to subscribed models over
 * HTTP. The connection will be re-attempted 20-30 minutes later. The back-off on the initial connection attempt is
 * to help avoid overloading the server with reconnection attempts caused by people reloading the page when there is
 * a problem with our websocket servers.
 *
 * If the WebSocket connection is lost at any time during the session, it will automatically be re-established (with
 * back-off). In most cases this will occur without the user noticing.
 */
export class RealtimeUpdaterClient {
  /**
   * When connected to a socket, this value will be the current SocketConnection instance. If the socket connection
   * fails and the user is polling, the value will be null.
   */
  socketConnection: SocketConnection | null;

  /**
   * An instance of the PollingConnection class. This is used to start or stop polling depending on whether the user
   * connected to the socket during the initial connection.
   */
  pollingConnection: PollingConnectionInstance | null;

  /**
   * Prior to a socket connection being established, this will be an instance of the PollingConnection class. If a
   * socket connection is made, this will be switched to an instance of the SocketConnection class.
   */
  currentConnection:
    | RealtimeConnectionInstance<PollingConnectionInstance>
    | RealtimeConnectionInstance<SocketConnection>
    | null;

  /**
   * Indicates if this is the first connection attempt when loading Trello. Only the first connection attempt is
   * eligible to fall back to polling. Subsequent connection attempts will never fall back to polling.
   */
  isInitialConnection: boolean;

  /**
   * Indicates if they have successfully connected to the socket at least once
   */
  hasConnectedOnce: boolean;

  /**
   * Realtime updates are blocked in one scenario only: when `trello_web_disconnect_active_clients` is set to `true`. This flag
   * is only used in the event of an incident when we need to shed websocket or polling traffic to help regain
   * the stability of Trello. It should never be reset to `true` in code. If a user is disconnected as a result of
   * this flag being enabled, they will need to reload Trello to get reconnected.
   */
  blockRealtimeUpdates: boolean;

  /**
   * Stops listening to websocket state.
   */
  unsubscribeFromWebSocketState: () => void = () => {};

  /**
   * Stops listening to internet connection state.
   */
  unsubscribeFromInternetHealth: () => void = () => {};

  /**
   * This is an identifier that will be used by analytics to trace connection/reconnection task
   * For more details see https://hello.atlassian.net/l/cp/ee1tpsTC
   */
  connectionTraceId: string | null = null;

  // We want to immediately open up a realtime connection channel, so we use AJAX until the socket has connected
  // and proven that it can answer a ping. If the socket connects and answers quickly, we use
  // that for all future requests. If not, we just close it down and keep using AJAX. We defer
  // setting up anything that will require polling on the AJAX until we either confirm or
  // give up on the socket.
  constructor() {
    this.socketConnection =
      this.pollingConnection =
      this.currentConnection =
        null;

    this.isInitialConnection = true;
    this.hasConnectedOnce = false;
    this.blockRealtimeUpdates = false;

    dynamicConfigClient.on<boolean>(
      'trello_web_disconnect_active_clients',
      (disconnectActiveClients?: boolean) => {
        if (disconnectActiveClients === true) {
          this.blockRealtimeUpdates = true;
          this.pollingConnection?.stopPolling?.();
        }
      },
    );

    // Always start the realtimeUpdaterClient if we're logged in, so we can get our notifications
    if (isMemberLoggedIn()) {
      this.createSocket();
    }
  }

  resubscribe() {
    return subscriptionManager
      .getSubscriptions()
      .forEach((subscription) =>
        this.subscribe(
          subscription.modelType,
          subscription.idModel,
          subscription.tags,
        ),
      );
  }

  setActiveConnection(
    connectionInstance: PollingConnectionInstance | SocketConnection | null,
  ) {
    this.currentConnection = connectionInstance;
  }

  /**
   * This function will be called immediately on page load if a user is logged in. If the user is anonymous, it will
   * be called the first time they subscribe to a model on a page.
   */
  createSocket() {
    if (this.socketConnection !== null) {
      return;
    }

    const countsByFailedReason: Record<FailedReason, number> = {
      TerminatedSession: 0,
      DisableReconnect: 0,
      DataTooLarge: 0,
      InconsistentData: 0,
      InvalidData: 0,
      ProtocolError: 0,
      DelayReconnect: 0,
      Normal: 0,
      PolicyViolation: 0,
      GoingAway: 0,
      ServerRestart: 0,
      BadGateway: 0,
      ClosedNoStatus: 0,
      MandatoryExtension: 0,
      Reserved: 0,
      ServerError: 0,
      ServerPingTimeout: 0,
      TryAgainLater: 0,
      TLSHandshakeFailed: 0,
      InternetUnhealthy: 0,
      ResyncError: 0,
      ConnectionAcknowledgementTimeout: 0,
      ConnectionAcknowledgementError: 0,
      ConnectionInitiationTimeout: 0,
      Abnormal: 0,
      ErrorSendingMessage: 0,
      MessageTimeout: 0,
      PingTimeout: 0,
      SubscriptionError: 0,
      Range_0_999: 0,
      Range_1000_2999: 0,
      Range_3000_3999: 0,
      Range_4000_4999: 0,
      error: 0,
      unknown: 0,
    };

    const rateLimiter = new RateLimiter({
      limits: {
        dailyFailures: {
          value: connectionConfig.getDailyReconnectLimit(),
          within: 86400000, // 24 hours
        },
        windowFailures: {
          value: connectionConfig.getActiveReconnectRateLimit(), // 8 attempts
          within: connectionConfig.getActiveReconnectRateWindow(), // 3 minutes
        },
      },
    });

    const failedReasons: FailedReason[] = [];
    let numAttemptsToCompleted = 0;
    let numConsecutiveFailuresWithoutConnecting = 0;
    let connectionStartedAt: number;

    if (!this.connectionTraceId) {
      this.connectionTraceId = startSocketConnectionTransaction({
        isFirstConnection: this.isInitialConnection,
      });
    }

    this.unsubscribeFromWebSocketState = webSocketState.subscribe(
      (newState, previousState) => {
        // If we transition from connected to another reconnection state,
        // start a task
        if (
          previousState === 'connected' &&
          isValidReconnectionState(newState)
        ) {
          this.connectionTraceId = startSocketConnectionTransaction({
            isFirstConnection: this.isInitialConnection,
          });
        }

        // If we don't have a connection trace id, but we have a valid reconnect state, that
        // means we aborted the connection attempt and need to make a new one. At this time,
        // that only happens if your internet goes unhealthy, and we abort the attempt.
        if (
          !this.isInitialConnection &&
          !this.connectionTraceId &&
          isValidReconnectionState(newState) &&
          internetConnectionState.value === 'healthy'
        ) {
          this.connectionTraceId = startSocketConnectionTransaction({
            isFirstConnection: this.isInitialConnection,
          });
        }

        // We have connected successfully, mark the transaction as successful
        if (previousState !== 'connected' && newState === 'connected') {
          if (this.connectionTraceId) {
            connectionSucceeded({
              isFirstConnection: this.isInitialConnection,
              traceId: this.connectionTraceId,
              analyticsAttributes: {
                attempts: numAttemptsToCompleted,
                countsByFailedReason: { ...countsByFailedReason },
              },
            });
          }
          this.connectionTraceId = null;
          this.hasConnectedOnce = true;
          numAttemptsToCompleted = 0;
        }
      },
      { onlyUpdateIfChanged: true },
    );

    this.unsubscribeFromInternetHealth = internetConnectionState.subscribe(
      (state) => {
        // If the user's internet becomes unhealthy, we want to close the socket connection as soon as possible. If we
        // don't do this, the socket will only disconnect after the ping times out (up to 24 seconds later).
        if (
          state === 'unhealthy' &&
          webSocketState.value !== 'waiting_to_reconnect'
        ) {
          this.socketConnection?.terminate(
            ClientCode.InternetUnhealthy,
            'Internet Unhealthy',
          );
        }
      },
      { onlyUpdateIfChanged: true },
    );

    this.pollingConnection = new PollingConnection();
    // Until the socket is connected, assume that we'll be polling.
    this.setActiveConnection(this.pollingConnection);

    // Create a new socket instance to force new Socket creation
    this.socketConnection = createSocketConnection({
      url: () =>
        `${getWebSocketUrl()}?clientVersion=${clientVersion}&x-b3-traceid=${
          this.connectionTraceId
        }&x-b3-spanid=${Analytics.get64BitSpanId()}`,
      connectionAckWaitTimeout:
        connectionConfig.getClientAcknowledgementTimeout(),
      connectionInitiationTimeout:
        connectionConfig.getClientAcknowledgementTimeout(),
      shouldRetry: (errOrCloseEvent) => {
        let reconnectionBlockedReason;
        let isRedboxReason = false;

        if (rateLimiter.hasReachedLimit('dailyFailures')) {
          reconnectionBlockedReason = `max reconnects limit reached (${connectionConfig.getDailyReconnectLimit()})`;
          isRedboxReason = true;
        } else if (rateLimiter.hasReachedLimit('windowFailures')) {
          reconnectionBlockedReason = 'rate limited';
          isRedboxReason = true;
        } else if (
          dynamicConfigClient.get('trello_web_disconnect_active_clients')
        ) {
          reconnectionBlockedReason = 'reconnections blocked';
        } else if (!isValidReconnectionState(webSocketState.value)) {
          // all other states shouldn't be allowed to reconnect
          // That means we're either redboxed, already connecting. etc.
          reconnectionBlockedReason = 'invalid reconnection state';
        } else if (isCloseEvent(errOrCloseEvent)) {
          // Specifically handles known close event codes, and takes appropriate action.
          if (
            (
              [
                ServerCode.TerminatedSession,
                ServerCode.DisableReconnect,
                ClientCode.ResyncError,
              ] as number[]
            ).includes(errOrCloseEvent.code)
          ) {
            reconnectionBlockedReason = 'terminating close code';
          }
        }

        if (reconnectionBlockedReason) {
          logConnectionInformation({
            source: 'websocket',
            payload: reconnectionBlockedReason,
            eventName: 'Reconnection blocked',
          });

          if (isRedboxReason) {
            safelyUpdateWebSocketState('rate_limited');

            Analytics.sendOperationalEvent({
              actionSubject: 'socketRedbox',
              action: 'errored',
              source: 'network:socketRpc',
              attributes: {
                reconnectNotAttemptedReason: reconnectionBlockedReason,
                countsByFailedReason,
                browser: browserStr,
                os: osStr,
                isActiveTab: monitor.getStatus() === 'active',
                isBrowserVisible: !monitor.getHidden(),
                isDesktop: isDesktop(),
                isMobile: isIos() || isAndroid(),
              },
            });
          }
        }

        return !reconnectionBlockedReason;
      },
      retryWait: async (errOrCloseEvent: CloseEvent | Event) => {
        safelyUpdateWebSocketState('waiting_to_reconnect');

        /**
         * Deferred is used here to manage the promises more easily.
         * Since we can have a user that comes back to their tab after being idle,
         * we would need to create a new promise and return that from this function instead.
         * Using deferred means we can just await deferred.getValueAsync() without
         * having to manage variables for which promise we want to resolve.
         */
        const deferred = new Deferred({
          msUntilFallback: Infinity,
          value: undefined,
        });

        /**
         * Hoist these variables up top before doing any asynchronous code,
         * because when a computer goes to sleep, we don't want to calculate
         * the recent attempts after the computer comes back online because
         * then recentAttempts would be 0 and we'd reconnect in 20-30 minutes.
         */
        let reconnectionTimeoutId: number = -1;
        const TWENTY_MINUTES_IN_MS = 20 * 60 * 1000;
        const THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;

        const rateWindowAttempts =
          rateLimiter.getAttemptsForWindow('windowFailures');
        const todaysAttempts =
          rateLimiter.getAttemptsForWindow('dailyFailures');
        const idleRateWindowAttempts = rateLimiter.getAttemptsWithin([
          Date.now() - connectionConfig.getIdleReconnectRateWindow(),
          Date.now(),
        ]);

        const closeEvent = isCloseEvent(errOrCloseEvent)
          ? errOrCloseEvent
          : undefined;
        const failedReason = isCloseEvent(errOrCloseEvent)
          ? getFailedReasonFromCloseEvent(errOrCloseEvent)
          : 'error';

        const startTime = Date.now();
        if (
          internetConnectionState.value === 'unhealthy' ||
          /**
           * A series of codes signal that we might have an issue with the internet
           * connection. If we do, mark the internet state to unhealthy so that we
           * can verify it in retryWait before reconnecting.
           */
          isPossiblyUnhealthyInternetFailure(failedReason)
        ) {
          logConnectionInformation({
            source: 'realtimeUpdater',
            eventName: 'Waiting until online',
          });
          await verifyAndUpdateInternetHealthUntilHealthy();
          logConnectionInformation({
            source: 'realtimeUpdater',
            eventName: 'Done waiting until online',
          });
        }
        const timeSpentVerifyingInternetHealth = Date.now() - startTime;

        // If we fail to establish the initial connection either because of an error or ping failure/timeout, then we don't
        // want to retry for 20-30 minutes. We do this because it's likely that there could be an ongoing server issue and
        // backing off aggressively helps shed load. If we were to use a shorter back-off interval for this logic it is highly
        // likely that we would make incidents far more severe. If this value is ever changed, it should be done with caution,
        // and probably not to a number below 5 minutes.
        if (
          !this.hasConnectedOnce &&
          isPossiblyDangerousFailure(failedReason)
        ) {
          logConnectionInformation({
            source: 'realtimeUpdater',
            eventName: 'First attempt failed, trying again in 20 - 30 minutes',
          });

          const delay = getBackOffDelay({
            range: [TWENTY_MINUTES_IN_MS, THIRTY_MINUTES_IN_MS],
            timeSpent: timeSpentVerifyingInternetHealth,
          });
          window.setTimeout(() => {
            deferred.setValue(undefined);
          }, delay);

          return deferred.getValueAsync();
        }

        let reconnectDelayRange: [number, number];

        const status = monitor.getHidden() ? 'idle' : monitor.getStatus();
        const connectionAttemptsWithinRateLimitWindowCount =
          status === 'active' ? rateWindowAttempts : idleRateWindowAttempts;

        /**
         * If there is a failure that appears to likely be from a server incident
         * then we need to backoff more quickly. In these cases, there are two important things to consider:
         * 1. We configure the backoffs such that we go more quickly from a short delay to a long delay. In this case
         * we do something like 1 attempt < 3000 ms, then backoff very quickly up to 30 minutes.
         * 2. We need to engineer a backoff that does not have correlated attempts, meaning that there are not
         * reconnection storms every n seconds/minutes. For example, if we just said reconnect in 20 minutes if there
         * is a dangerous failure, then in 20 minutes millions of clients would try to connect at the same time, and
         * probably crash server again. So the backoff delays need to be non uniform.
         */
        if (isServerIncidentFailure(failedReason)) {
          const attemptsCount = Math.max(
            connectionAttemptsWithinRateLimitWindowCount,
            numConsecutiveFailuresWithoutConnecting,
          );

          reconnectDelayRange = calculateBackOffRange({
            status,
            attemptsCount,
            statusMultipliersOverride: {
              active: Math.min(attemptsCount + 1, 3),
              idle: 10,
            },
            connectionHealth: 'serverIncident',
          });
        } else {
          reconnectDelayRange = calculateBackOffRange({
            status,
            attemptsCount: connectionAttemptsWithinRateLimitWindowCount,
          });
        }

        /**
         * Server can send reconnect delays for specific scenarios. Right now that is
         * only for permission changes where it closes the socket and tells us to reconnect
         * 1 second later. However, this is built broadly to handle other reconnect delays
         * issued from server.
         */
        if (closeEvent?.code === ServerCode.DelayReconnect) {
          // eslint-disable-next-line radix
          const seconds = parseInt(closeEvent.reason, 0);

          if (!isNaN(seconds)) {
            // We don't apply the reconnection count multiplier when there is a server issued delay. Nor do we take into account
            // the maximum reconnect delay.
            const serverIssuedDelay = getMilliseconds({ seconds });
            if (status === 'active') {
              reconnectDelayRange = [serverIssuedDelay, serverIssuedDelay * 5];
            } else {
              reconnectDelayRange = [
                serverIssuedDelay * 4,
                serverIssuedDelay * 17,
              ];
            }
          }
        }

        const reconnectDelay = getBackOffDelay({
          range: reconnectDelayRange,
          timeSpent: timeSpentVerifyingInternetHealth,
        });

        let reconnectionAllowedAt = Date.now() + reconnectDelay;
        const connectionClosedAt = Date.now();

        logConnectionInformation({
          source: 'websocket',
          payload: {
            reconnectionAllowedIn: `${reconnectDelay}ms`,
            delayReason: 'Default delay',
            monitorStatus: monitor.getStatus(),
            monitorHidden: monitor.getHidden(),
            reconnectDelayRange,
            recentAttempts: rateWindowAttempts,
            todaysAttempts,
          },
          eventName: 'WebSocket closed',
        });

        /**
         * If user will go from idle to active state or from hidden to visible,
         * we need to reset the delay to 'active' so they reconnect quicker.
         */
        let unsubscribeFromMonitorStatus = () => {};
        const resetDelayIfActive = () => {
          if (
            monitor.getStatus() === 'active' &&
            !monitor.getHidden() &&
            webSocketState.value === 'waiting_to_reconnect'
          ) {
            unsubscribeFromMonitorStatus();
            monitorEvents.off('visibilitychange', resetDelayIfActive, null);
            window.clearTimeout(reconnectionTimeoutId);

            const activeReconnectDelayRange = calculateBackOffRange({
              status: 'active',
              attemptsCount: connectionAttemptsWithinRateLimitWindowCount,
            });

            const delayAfterVerifyingInternetHealth = getBackOffDelay({
              range: activeReconnectDelayRange,
              timeSpent: timeSpentVerifyingInternetHealth,
            });

            const actualReconnectionDelay = Math.min(
              delayAfterVerifyingInternetHealth,
              Math.max(0, reconnectionAllowedAt - Date.now()),
            );

            reconnectionAllowedAt =
              connectionClosedAt + actualReconnectionDelay;

            logConnectionInformation({
              source: 'websocket',
              payload: {
                reconnectionAllowedIn: `${actualReconnectionDelay}ms`,
                reconnectDelayRange: activeReconnectDelayRange,
                recentAttempts: rateWindowAttempts,
                todaysAttempts,
              },
              eventName: 'Bringing forward reconnection (user active)',
            });

            if (actualReconnectionDelay === 0) {
              deferred.setValue(undefined);
            } else {
              window.setTimeout(() => {
                deferred.setValue(undefined);
              }, actualReconnectionDelay);
            }
          }
        };

        if (status === 'idle') {
          unsubscribeFromMonitorStatus = monitorStatus.subscribe(
            resetDelayIfActive,
            { onlyUpdateIfChanged: true },
          );
          monitorEvents.on('visibilitychange', resetDelayIfActive);

          /**
           * If users get the same ServerPingTimeout failure over and over, it signals that
           * their browser/os has broken their ability to use sockets while idle. This occurs mainly
           * when users have been away from their tab on a windows os, and as a result the ping/pong
           * handshakes that server and web do stop working. From server's point of view, it doesn't get
           * a pong response from web within 60 seconds, so it sends a ping timeout close code.
           * To combat this problem, if we start to get this failure over and over while idle, we just
           * wait for the tab to become active instead of trying to reconnect while idle.
           */
          if (
            getNumConsecutiveFailures(failedReasons, 'ServerPingTimeout') > 3
          ) {
            // Wait for the monitor status to change to "active", which will resolve this promise.
            return deferred.getValueAsync();
          }
        }

        // This is cancelled if the user becomes active in their tab
        reconnectionTimeoutId = window.setTimeout(() => {
          deferred.setValue(undefined);
        }, reconnectDelay);

        await deferred.getValueAsync();
        // unsubscribe from things we don't need anymore
        unsubscribeFromMonitorStatus();
        monitorEvents.off('visibilitychange', resetDelayIfActive, null);
        return;
      },
      on: {
        connecting: () => {
          numAttemptsToCompleted++;

          // We remove the connection attempt if this is the first time connecting, and it only took
          // one attempt. Otherwise, the first time the user disconnects from the socket, we will
          // use longer reconnect delays on them, which isn't really necessary.
          if (!this.isInitialConnection) {
            rateLimiter.addItem();
          }

          safelyUpdateWebSocketState('connecting');

          connectionStartedAt = Date.now();
        },
        connected: () => {
          numConsecutiveFailuresWithoutConnecting = 0;
          // Yay, we have sockets!
          this.setActiveConnection(this.socketConnection);
          this.pollingConnection?.stopPolling();
          this.resubscribe();
          realtimeUpdaterEvents.trigger('ready');
          safelyUpdateWebSocketState('connected');
          // Do this at the end
          this.isInitialConnection = false;
        },
        error: (error) => {
          logConnectionInformation({
            source: 'realtimeUpdater',
            eventName: 'websocket errored',
          });

          if (!this.isInitialConnection) {
            if (
              isFastFailure({
                startedAt: connectionStartedAt,
                failedAt: Date.now(),
              })
            ) {
              rateLimiter.removeItem();
            } else {
              numConsecutiveFailuresWithoutConnecting++;
              countsByFailedReason['error']++;
              failedReasons.push('error');
            }
          }

          // For errors that occurred on the initial connection, we mark the connection
          // transaction as failed, because create-session/socket will fail. Otherwise, the
          // reconnect-session/socket capabilities are handled in the webSocketState.subscribe.
          if (this.isInitialConnection) {
            if (this.connectionTraceId) {
              connectionFailed({
                traceId: this.connectionTraceId,
                error: new Error('WebSocket errored'),
              });
              this.connectionTraceId = null;
            }
          }

          // This line of code is EXTREMELY important. It guards against us falling back to polling on reconnections in the
          // event that the WebSocket servers go down. By only allowing user's to fall back to polling only on the initial
          // connection, it means we avoid the possibility of millions of users suddenly overloading the API server by
          // simultaneously switching from sockets to polling.
          if (this.isInitialConnection) {
            this.pollingConnection?.poll();
            this.resubscribe();
            realtimeUpdaterEvents.trigger('ready');
          }

          safelyUpdateWebSocketState('closed');

          // Do this at the end
          this.isInitialConnection = false;
        },
        closed: (closeEvent: CloseEvent) => {
          const reason = getFailedReasonFromCloseEvent(closeEvent);

          logConnectionInformation({
            source: 'realtimeUpdater',
            eventName: 'Closed',
            payload: { reason, code: closeEvent.code },
          });

          if (!this.isInitialConnection) {
            if (
              isFastFailure({
                startedAt: connectionStartedAt,
                failedAt: Date.now(),
              })
            ) {
              rateLimiter.removeItem();
            } else {
              numConsecutiveFailuresWithoutConnecting++;
              countsByFailedReason[reason]++;
              failedReasons.push(reason);
            }
          }

          // For closures that occurred on the initial connection, we mark the connection
          // transaction as failed, because create-session/socket will fail. Otherwise, the
          // reconnect-session/socket capabilities are handled in the webSocketState.subscribe.
          if (this.isInitialConnection) {
            if (this.connectionTraceId) {
              connectionFailed({
                traceId: this.connectionTraceId,
                error: new Error(reason),
              });
              this.connectionTraceId = null;
            }
          }

          if (closeEvent.code === ServerCode.TerminatedSession) {
            let redirectUrl = '/logged-out';
            // Token has been invalidated and user
            // needs to be logged out.
            if (isEmbeddedInMSTeams()) {
              // MS Teams integration should redirect to the proper initial page, otherwise the page will not be displayable in the iframe
              redirectUrl = `/integrations/teams/tab-content?iframeSource=msteams&contentUrl=${encodeURIComponent(
                window.location.href,
              )}`;
            }

            // A terminated session likely means that the user's token has expired on been invalidated. The user will need
            // to log back in to Trello.
            window.location.replace(redirectUrl);
          } else if (closeEvent.code === ServerCode.DisableReconnect) {
            // The server has sent back a code indicating that the client should not be allowed to reconnect. We move the user to the
            // "FORCE_DISCONNECTED" state, which means they will be shown an error message and will never automatically reconnect to Trello.
            // They will need to reload the page to reconnect.
            safelyUpdateWebSocketState('force_disconnected');
          } else if (closeEvent.code === ClientCode.ResyncError) {
            // The server was not able to process client's resync request because it is too far behind.
            // We are disconnecting from websocket to prevent applying realtime updates to the stale data.
            // User is required to refresh the page manually and request the up-to-date data from scratch.
            safelyUpdateWebSocketState('too_far_behind');
          } else if (
            // The server took too long to acknowledge the connection
            closeEvent.code === ClientCode.ConnectionAcknowledgementTimeout ||
            // The server responded with "result": false or "error": "..."
            closeEvent.code === ClientCode.ConnectionAcknowledgementError ||
            // The server never opened the socket
            closeEvent.code === ClientCode.ConnectionInitiationTimeout
          ) {
            // This line of code is EXTREMELY important. It guards against us falling back to polling on reconnections in the
            // event that the WebSocket servers go down. By only allowing user's to fall back to polling on the initial
            // connection, it means we avoid the possibility of millions of users suddenly overloading the API server by
            // simultaneously switching from sockets to polling.
            if (this.isInitialConnection) {
              this.pollingConnection?.poll();
              this.resubscribe();
              realtimeUpdaterEvents.trigger('ready');
            }

            safelyUpdateWebSocketState('closed');
          } else {
            safelyUpdateWebSocketState('closed');
          }

          this.isInitialConnection = false;
        },
      },
    });
  }

  unsubscribe(
    modelType: 'Board' | 'Enterprise' | 'Member' | 'Organization',
    idModel: string,
  ) {
    subscriptionManager.removeSubscription(modelType, idModel);
    this.createSocket();
    this.currentConnection?.unsubscribe?.(modelType, idModel);
  }

  _subscribeOrHandle(
    modelType: 'Board' | 'Enterprise' | 'Member' | 'Organization',
    idModel: string,
    tags: string[],
  ): Promise<unknown | typeof realtimeUpdaterEvents> {
    return fromNode((next) => {
      return this.currentConnection?.subscribe?.(
        modelType,
        idModel,
        // @ts-expect-error the type of "tags" cannot be inferred here yet
        tags,
        next,
      );
    }).catch((err) => {
      if (INVALID_MODEL_ERRORS.includes(err.message)) {
        subscriptionManager.handleInvalidSubscription(idModel);
        return realtimeUpdaterEvents.trigger(
          'subscription_invalid',
          modelType,
          idModel,
          tags,
        );
      }
    });
  }

  subscribe(
    modelType: 'Board' | 'Enterprise' | 'Member' | 'Organization',
    idModel: string,
    tags: Tag[],
  ): Promise<unknown | typeof realtimeUpdaterEvents> {
    this.createSocket();
    subscriptionManager.addSubscription(modelType, idModel, tags);

    return this._subscribeOrHandle(modelType, idModel, tags);
  }
}
