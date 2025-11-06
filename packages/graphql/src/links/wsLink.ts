import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import type { ConnectionAckMessage, Message } from 'graphql-ws';
import { createClient } from 'graphql-ws';

import { getApiGatewayUrl } from '@trello/api-gateway';
import { Analytics } from '@trello/atlassian-analytics';
import { browserStr, osStr } from '@trello/browser';
import { sendErrorEvent } from '@trello/error-reporting';
import {
  dangerouslyGetFeatureGateSync,
  getFeatureGateAsync,
} from '@trello/feature-gate-client';
import {
  internetConnectionState,
  verifyAndUpdateInternetHealthUntilHealthy,
} from '@trello/internet-connection-state';
import { monitor, monitorStatus } from '@trello/monitor';
import {
  calculateBackOffRange,
  getBackOffDelay,
} from '@trello/reconnect-back-off';
import { TrelloStorage } from '@trello/storage';
import {
  logConnectionInformation,
  safelyUpdateGraphqlWebsocketState,
} from '@trello/web-sockets';

import { sequenceNumberState } from '../sequenceNumberState';
import { getUniqueSubscriptionKey } from './utils/getUniqueSubscriptionKey';
import { replayCircuitBreaker } from './utils/replayCircuitBreaker';

const SUBSCRIPTIONS_GATE_NAME = 'gql_client_subscriptions';

let enforcedDelayRange: [number, number] | null = null;

/**
 * For now, don't attempt to replay messages for the following
 * operations. In particular, the planner workspace subscription
 * always needs to re-query when the webhook expires so just
 * rely on that for now.
 */
const DISABLE_REPLAY_OPERATIONS = new Set(['TrelloPlannerWorkspaceUpdated']);

export const includeReplayInMessage = (message: string): string => {
  try {
    const parsedMessage = JSON.parse(message) as Message;
    if (
      parsedMessage.type === 'subscribe' &&
      sequenceNumberState.value !== null
    ) {
      const operationName = parsedMessage.payload.operationName;
      const variables = parsedMessage.payload.variables ?? {};
      if (!operationName || DISABLE_REPLAY_OPERATIONS.has(operationName)) {
        return message;
      }
      const key = getUniqueSubscriptionKey(operationName, variables);

      if (!replayCircuitBreaker.canReplay(key)) {
        return message;
      }
      replayCircuitBreaker.recordReplayAttempt(key);

      const sequenceNumber =
        key in sequenceNumberState.value
          ? sequenceNumberState.value[key]
          : null;
      if (sequenceNumber === null) {
        return message;
      }
      if (parsedMessage.payload.extensions?.command !== undefined) {
        // If the command is already set, don't override it
        return message;
      }
      // reconstruct the message with the sequence number
      const messageWithReplay = {
        ...parsedMessage,
        payload: {
          ...parsedMessage.payload,
          extensions: {
            ...parsedMessage.payload.extensions,
            command: {
              type: 'replay',
              data: {
                sequenceNumber,
              },
            },
          },
        },
      };
      sequenceNumberState.setValue((prev) => ({
        ...prev,
        [key]: null,
      }));
      return JSON.stringify(messageWithReplay);
    }
  } catch (e) {
    sendErrorEvent(e);
  }
  return message;
};

const getDelayRangeFromGraphqlWebsocketState = async (retries: number) => {
  const lessAggressiveReconnect = await getFeatureGateAsync(
    'goo_slower_client_reconnects',
  );

  /**
   * We're overriding the status multipliers here to make the reconnection
   * back-off less aggressive.  For the 2AF we need to reduce client
   * reconnect load on graphql-subscriptions.
   *
   * We need to use a feature gate here to add a stop gap measure to reduce
   * reconnect load. The initial attempt at this created issues with
   * feature gates in the members page if the feature gate storage was deleted.
   *
   * The default status multipliers are: { active: 1, idle: 10 }.
   */

  const activeMultiplier = lessAggressiveReconnect ? 5 : 1;

  const status = monitor.getHidden() ? 'idle' : monitor.getStatus();
  const retryDelayRange = calculateBackOffRange({
    status,
    attemptsCount: retries,

    statusMultipliersOverride: {
      active: activeMultiplier,
      idle: 10,
    },
  });

  return retryDelayRange;
};

export const retryWait = async (retries: number) => {
  const retryDelayRange =
    enforcedDelayRange ??
    (await getDelayRangeFromGraphqlWebsocketState(retries));

  safelyUpdateGraphqlWebsocketState('waiting_to_reconnect');
  // This is the logic reused from legacy WebSocket with a check verifyAndUpdateInternetHealthUntilHealthy
  // If the internet connection is healthy then we can retry, otherwise we do not need to retry
  // We subtract the time spent waiting to reconnect from the exponential backoff

  logConnectionInformation({
    source: 'graphqlWebsocketLink',
    eventName: 'Waiting until online',
    payload: {
      retries,
    },
  });
  const startedAt = Date.now();

  // Wait until the internet is healthy to try and connect
  await verifyAndUpdateInternetHealthUntilHealthy();
  logConnectionInformation({
    source: 'graphqlWebsocketLink',
    eventName: 'Done waiting until online',
  });
  // since we took some time to verify internet health, reduce the exponential backoff
  const msCheckingInternetHealth = Date.now() - startedAt;
  const retryDelay = getBackOffDelay({
    range: retryDelayRange,
    timeSpent: msCheckingInternetHealth,
  });

  logConnectionInformation({
    source: 'graphqlWebsocket',
    payload: {
      reconnectionAllowedIn: `${retryDelay}ms`,
      delayReason: 'Default delay',
      monitorStatus: monitor.getStatus(),
      monitorHidden: monitor.getHidden(),
      retryDelayRange,
    },
    eventName: 'GraphQL WebSocket reconnection delay',
  });

  let monitorUnsubscribe: (() => void) | undefined;
  // Wait the remaining delay. If we waited to reconnect longer than the original exponential backoff
  // then we will retry immediately.
  await new Promise((resolve) => {
    let timeoutId = setTimeout(resolve, retryDelay);

    monitorUnsubscribe = monitorStatus.subscribe(
      (status) => {
        const newRetryDelayRange =
          enforcedDelayRange ??
          calculateBackOffRange({
            status,
            attemptsCount: retries,
          });
        const msAlreadyWaited = Date.now() - startedAt;
        const newRetryDelay = getBackOffDelay({
          range: newRetryDelayRange,
          timeSpent: msAlreadyWaited,
        });

        const actualReconnectionDelay = Math.max(
          newRetryDelay - msAlreadyWaited,
          0,
        );

        logConnectionInformation({
          source: 'graphqlWebsocket',
          payload: {
            reconnectionAllowedIn: `${actualReconnectionDelay}ms`,
            reconnectDelayRange: newRetryDelayRange,
          },
          eventName: 'Bringing forward reconnection (user active)',
        });

        // Clear old timeout and set a new one with the updated delay
        clearTimeout(timeoutId);
        timeoutId = setTimeout(resolve, actualReconnectionDelay);
      },
      { onlyUpdateIfChanged: true },
    );
  });
  monitorUnsubscribe?.();
};

export const shouldRetry = (errOrCloseEvent?: unknown) => {
  logConnectionInformation({
    source: 'graphqlWebsocketLink',
    eventName: 'GraphQL websocket determining retry',
    payload: {
      errOrCloseEvent,
    },
  });
  return dangerouslyGetFeatureGateSync(SUBSCRIPTIONS_GATE_NAME);
};

const getCommonEventAttributes = () => ({
  monitorStatus: monitor.getStatus(),
  monitorHidden: monitor.getHidden() === true ? 'hidden' : 'visible',
  internetConnectionState: internetConnectionState.value,
  browser: browserStr,
  os: osStr,
});

/**
 * Modeled after getWebSocketUrl function in realtime-updater package
 */
const getSubscriptionUrl = () => {
  const protocol = document.location.protocol === 'http:' ? 'ws:' : 'wss:';
  return `${protocol}//${document.location.host}${getApiGatewayUrl(
    '/graphql/subscriptions',
  )}`;
};

export const createWsLink = () => {
  let traceId: string | null = null;
  let hasConnectedOnce = false;
  const wsLink = new GraphQLWsLink(
    createClient({
      keepAlive:
        TrelloStorage.get('useGraphqlWebsocketPings') === 'true' &&
        dangerouslyGetFeatureGateSync('goo_send_ws_ping')
          ? 60_000
          : undefined,
      connectionAckWaitTimeout: 15_000,
      url: () => {
        if (!traceId) {
          if (dangerouslyGetFeatureGateSync(SUBSCRIPTIONS_GATE_NAME)) {
            traceId = Analytics.startTask({
              taskName: 'create-session/socket/graphql',
              source: 'wsLink',
            });

            return `${getSubscriptionUrl()}?x-b3-traceid=${traceId}&x-b3-spanid=${Analytics.get64BitSpanId()}`;
          }
        }

        return getSubscriptionUrl();
      },
      retryAttempts: 100,
      retryWait,
      shouldRetry,
      on: {
        connecting: () => {
          safelyUpdateGraphqlWebsocketState('connecting');
        },
        connected: (
          socket: unknown,
          _payload: ConnectionAckMessage['payload'],
          wasRetry: boolean,
        ) => {
          hasConnectedOnce = true;
          safelyUpdateGraphqlWebsocketState('connected');
          logConnectionInformation({
            source: 'graphqlWebsocket',
            payload: {
              wasRetry,
              ...getCommonEventAttributes(),
            },
            eventName: 'GraphQL WebSocket connected',
          });
          if (traceId) {
            Analytics.taskSucceeded({
              taskName: 'create-session/socket/graphql',
              source: 'wsLink',
              traceId,
              attributes: {
                ...getCommonEventAttributes(),
                wasRetry,
                enforcedDelayRange,
              },
            });
            traceId = null;
          }
          enforcedDelayRange = null;

          const isFeatureGateEnabled = dangerouslyGetFeatureGateSync(
            'goo_sequence_number_replays',
          );

          if (!isFeatureGateEnabled) {
            return;
          }

          if (typeof socket !== 'object' || !(socket instanceof WebSocket)) {
            return;
          }

          /**
           * Intercept the send message to add the sequence number to the payload.
           * The cacheSubscriptionResponseLink is not called when the socket is
           * closed but the subscription is still active. The graphql-ws client handles
           * the reconnect for subscriptions that are not completed. In this case we need
           * to manually add the sequence number to the payload, then we can call the
           * original send method.
           */
          const originalSend = socket.send.bind(socket);
          socket.send = (message: string) => {
            const parsedMessageMaybeWithReplay =
              includeReplayInMessage(message);
            return originalSend(parsedMessageMaybeWithReplay);
          };
        },
        closed: (event) => {
          if (!(event instanceof CloseEvent)) {
            safelyUpdateGraphqlWebsocketState('closed');
            Analytics.sendOperationalEvent({
              action: 'closed',
              actionSubject: 'graphqlSocketConnection',
              source: 'network:socket',
              attributes: {
                code: 'unknown',
                reason: 'unknown',
                wasClean: false,
                ...getCommonEventAttributes(),
              },
            });
            return;
          }

          logConnectionInformation({
            source: 'graphqlWebsocket',
            payload: {
              code: event.code,
              reason: event.reason,
              wasClean: event.wasClean,
              ...getCommonEventAttributes(),
            },
            eventName: 'GraphQL WebSocket closed',
          });

          switch (event.code) {
            /**
             * Planner related close codes.
             */
            case 1013:
            case 4410: {
              safelyUpdateGraphqlWebsocketState('closed_by_server');
              enforcedDelayRange = [1000, 5000];
              break;
            }
            /**
             * 4429 is treated an un recoverable error by the graphql-ws client. To prevent this,
             * graphql-subscriptions will send either a 429 or 430 to indicate rate limiting.
             * Originally we were using 4429 and 4430, but GQLS changed this to use 429 instead.
             */
            case 429:
            case 430: {
              if (
                !dangerouslyGetFeatureGateSync(
                  'goo_use_graphql_ws_rate_limiting',
                )
              ) {
                break;
              }

              safelyUpdateGraphqlWebsocketState('rate_limited');
              const minDelay = parseInt(event.reason, 10) ?? 10;
              enforcedDelayRange = [minDelay * 1000, minDelay * 1000 * 5];
              break;
            }
            case 4430: {
              if (
                !dangerouslyGetFeatureGateSync(
                  'goo_use_graphql_ws_rate_limiting',
                )
              ) {
                break;
              }

              safelyUpdateGraphqlWebsocketState('rate_limited');
              const minDelay = parseInt(event.reason, 10) ?? 10;
              enforcedDelayRange = [minDelay * 1000, minDelay * 1000 * 5];
              break;
            }

            /**
             * The graphql-ws client will close the socket with this code if it doesn't receive a connection ack message within the
             * connectionAckWaitTimeout.
             *
             * This can be emblematic of a underlying server incident for graphql-subscriptions, so we should aggressively backoff
             * to shed load.
             *
             * Checking if the user has already connected helps ensure that refreshed tabs don't overload the server with too many
             * reconnection attempts via the slower normal backoff.
             */
            case 4504: {
              if (
                !dangerouslyGetFeatureGateSync(
                  'goo_gql_ws_connection_ack_timeout',
                )
              ) {
                break;
              }
              const twentyMinutesInMs = 20 * 60 * 1000;
              const thirtyMinutesInMs = 30 * 60 * 1000;

              if (!hasConnectedOnce) {
                enforcedDelayRange = [twentyMinutesInMs, thirtyMinutesInMs];
                logConnectionInformation({
                  source: 'graphqlWebsocket',
                  eventName:
                    'GraphQL websocket never received a connection ack message, backing off for 20-30 minutes',
                  payload: {
                    code: event.code,
                    reason: event.reason,
                  },
                });
              }

              if (traceId) {
                /*
                 * The on.connected callback only runs after we receive a connection ack message,
                 * so we need to mark the task as failed. Otherwise it would be a timeout.
                 */
                Analytics.taskFailed({
                  taskName: 'create-session/socket/graphql',
                  source: 'wsLink',
                  traceId,
                  error: event.reason,
                });
                traceId = null;
              }
              safelyUpdateGraphqlWebsocketState('closed');
              break;
            }

            /**
             * These are the internal fatal error codes that the graphql-ws client
             * will not attempt to retry. If we ever receive any of these codes,
             * then it means the client will be in a bad state and unable
             * to receive socket messages. We should show a corresponding
             * flag to indicate this to the client.
             *
             * See the below link for the source of these codes:
             * https://github.com/enisdenjo/graphql-ws/blob/master/src/client.ts#L330
             */
            case 4004:
            case 4005:
            case 4400:
            case 4401:
            case 4406:
            case 4409:
            case 4429:
            case 4500: {
              safelyUpdateGraphqlWebsocketState('disconnected');
              break;
            }

            default: {
              safelyUpdateGraphqlWebsocketState('closed');
            }
          }

          /**
           * We're temporarily sending an operational event to see if we're receiving
           * any close codes back from the graphql-subscriptions service.
           */
          Analytics.sendOperationalEvent({
            action: 'closed',
            actionSubject: 'graphqlSocketConnection',
            source: 'network:socket',
            attributes: {
              code: event.code,
              reason: event.reason,
              wasClean: event.wasClean,
              ...getCommonEventAttributes(),
            },
          });
        },
        error: () => {
          logConnectionInformation({
            source: 'graphqlWebsocketLink',
            eventName: 'graphql websocket errored',
          });
          safelyUpdateGraphqlWebsocketState('disconnected');
          if (traceId) {
            Analytics.taskFailed({
              taskName: 'create-session/socket/graphql',
              source: 'wsLink',
              traceId,
              error: new Error('Could not connect'),
            });

            traceId = null;
          }
        },
      },
    }),
  );

  /**
   * If the internet goes offline, then terminate the socket so that it reconnects.
   * This will end up waiting until we are online before reconnecting.
   */
  internetConnectionState.subscribe(
    (state) => {
      if (state === 'unhealthy') {
        wsLink.client.terminate();
      }
    },
    { onlyUpdateIfChanged: true },
  );

  return wsLink;
};

export const wsLink = createWsLink();
