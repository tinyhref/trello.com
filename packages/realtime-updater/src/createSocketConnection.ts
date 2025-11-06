import { Analytics } from '@trello/atlassian-analytics';
import { getInvitationTokens } from '@trello/invitation-tokens/getInvitationTokens';
import { logConnectionInformation } from '@trello/web-sockets';

import { closeWithCode } from './closeWithCode';
import { connectionConfig } from './connectionConfig';
import { isCloseEvent } from './isCloseEvent';
import { parseMessage } from './parseMessage';
import { realtimeUpdaterEvents } from './realtimeUpdaterEvents';
import { resync } from './resync';
import { WebSocketReadyState, type SubscriptionError } from './socket.types';
import type {
  ClientPingMessage,
  ClientSubscribeMessage,
  ClientUnsubscribeMessage,
  ConnectionReason,
  EventListener,
  EventMessageListener,
  RequestId,
  ServerConnectionAckMessage,
  ServerMessage,
  SocketEvent,
} from './SocketConnection.types';
import { ClientCode } from './SocketConnection.types';
import { subscriptionManager } from './subscriptionManager';

export type Callback = (
  error: Error | SubscriptionError | string | null,
  result?: boolean | number | object | string,
  socketConnection?: ReturnType<typeof createSocketConnection>,
) => void;

const ping: {
  lastTimestamp: number | null;
  timeoutId: number;
  rafId: { value: number };
} = {
  // A timestamp that indicates the last time we received the '' (ping) message from the server.
  lastTimestamp: null,
  timeoutId: -1,
  rafId: { value: -1 },
};

/**
 * Check if the ping time out has passed. For example, if the last time
 * we got a ping was 30 seconds ago, and the timeoutDuration is 24 seconds,
 * then this will return true.
 */
const pingTimeoutHasPassed = ({
  timeoutDuration,
}: {
  timeoutDuration: number;
}) => {
  if (ping.lastTimestamp === null) {
    return false;
  }

  const current = new Date().getTime(),
    delta = current - ping.lastTimestamp;
  return delta >= timeoutDuration;
};

/**
 * We use a requestAnimationFrame in loop to check if the ping timeout
 * has passed.
 */
const startPingMonitoring = function ({
  onTimeout,
  timeoutDuration,
}: {
  onTimeout: () => void;
  timeoutDuration: number;
}): { value: number } {
  const handle = { value: -1 };

  function loop() {
    if (pingTimeoutHasPassed({ timeoutDuration })) {
      onTimeout();
      handle.value = -1;
      return;
    }

    handle.value = requestAnimationFrame(loop);
  }

  handle.value = requestAnimationFrame(loop);

  return handle;
};

export function createSocketConnection(options: {
  url: string | (() => string);
  shouldRetry: (errOrCloseEvent: CloseEvent | Event) => boolean;
  retryWait: (errOrCloseEvent: CloseEvent | Event) => Promise<void>;
  connectionAckWaitTimeout: number;
  connectionInitiationTimeout: number;
  on?: Partial<{ [event in SocketEvent]: EventListener<event> }>;
}) {
  const {
    url,
    connectionAckWaitTimeout,
    connectionInitiationTimeout,
    on,
    shouldRetry,
    retryWait,
  } = options;

  /**
   * An integer ID for the message that is unique to the connection. The initial ping message from the client will have
   * a reqid of 0, and every subsequent message from the client will be incremented by 1. The reqid variable is used to
   * match up outgoing messages from the client with incoming messages from the server. This allows callback to be
   * assigned for a specific message.
   */
  let reqid: RequestId = 1;

  /**
   * When a message is sent, we start a timer to ensure that the message result is received in a timely manner. If no
   * message is received within 20 seconds, the socket is closed with the MessageTimeout code (4503). This variable
   * stores the ID of the timer used when sending the message so that it can be cancelled when a result is received.
   */
  let messageResultTimeoutId: number | null = null;

  /**
   * The active WebSocket instance. This value will be null if the connection is closed.
   */
  let ws: WebSocket | null = null;

  /**
   * When sending a message, consumers can subscribe to the response by providing a callback function. This object
   * maintains a reference to the callback so that it can be called when the response is received in the onmessage
   * handler. This relies on the fact that the callback can be stored and identified by using the reqid, which will be
   * unique to this connection.
   */
  let dictCallback: {
    [key: `fx${RequestId}`]: Callback;
  } = {};

  /**
   * An array of buffered messages. If the client attempts to send a message to the server before the connection is
   * established, the message will be buffered. Buffered messages will be sent to the server upon successful connection.
   */
  let buffer: string[] = [];

  /**
   * Indicates whether a successful connection has ever been established with the server. This will be set to true
   * when the WebSocket is open and the server has sent an acknowledgement message.
   */
  let connectedOnce = false;

  ping.lastTimestamp = null;
  ping.rafId = { value: -1 };

  /**
   * An event emitter that is exposed through the public API of createSocketConnection. This allows the consumer to
   * subscribe to key events and messages. e.g:
   *
   * const socketConnection = createSocketConnection({
   *   on: {
   *     connected: () => {
   *       console.log('Successfully connected to socket!');
   *     }
   *   }
   * });
   *
   */
  const emitter = (() => {
    const message = (() => {
      const listeners: { [key: string]: EventMessageListener } = {};
      return {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        on(reqid: string, listener: EventMessageListener) {
          listeners[reqid] = listener;
          return () => {
            delete listeners[reqid];
          };
        },
        // eslint-disable-next-line @typescript-eslint/no-shadow
        emit(message: ServerMessage) {
          if (message === '') {
            return;
          }
          if ('reqid' in message) listeners[message.reqid]?.(message);
        },
      };
    })();
    const listeners: { [event in SocketEvent]: EventListener<event>[] } = {
      connecting: on?.connecting ? [on.connecting] : [],
      opened: on?.opened ? [on.opened] : [],
      connected: on?.connected ? [on.connected] : [],
      ping: on?.ping ? [on.ping] : [],
      pong: on?.pong ? [on.pong] : [],
      message: on?.message ? [message.emit, on.message] : [message.emit],
      closed: on?.closed ? [on.closed] : [],
      error: on?.error ? [on.error] : [],
    };

    return {
      onMessage: message.on,
      on<TEvent extends SocketEvent>(
        event: TEvent,
        listener: EventListener<TEvent>,
      ) {
        const l = listeners[event] as EventListener<TEvent>[];
        l.push(listener);
        return () => {
          l.splice(l.indexOf(listener), 1);
        };
      },
      emit<TEvent extends SocketEvent>(
        event: TEvent,
        ...args: Parameters<EventListener<TEvent>>
      ) {
        // we copy the listeners so that unlistens don't "pull the rug under our feet"
        for (const listener of [...listeners[event]]) {
          // @ts-expect-error: The args should fit
          listener(...args);
        }
      },
    };
  })();

  /**
   * Sends a message over the socket, or buffers the message to be sent later. Buffering occurs if the socket is not
   * yet connected, or if there is an error when sending the message.
   */
  const _send = (data: string, isConnectionAckMessage?: boolean) => {
    if (ws?.readyState === WebSocketReadyState.Open || isConnectionAckMessage) {
      try {
        ws?.send(data);
      } catch (error) {
        buffer.push(data);
        logConnectionInformation({
          source: 'websocket',
          payload: error instanceof Error ? error.message : 'unknown error',
          eventName: 'Error sending message',
        });
        closeWithCode(
          ws,
          ClientCode.ErrorSendingMessage,
          'Error Sending Message',
        );
      }
    } else {
      buffer.push(data);
    }
  };

  /**
   * Sends a message over the socket, and registers a callback that will be called when the response is received from
   * the server.
   */
  const send = (
    msg:
      | Omit<ClientPingMessage, 'reqid'>
      | Omit<ClientSubscribeMessage, 'reqid'>
      | Omit<ClientUnsubscribeMessage, 'reqid'>,
    next: (
      err: SubscriptionError,
      response: number | object | string,
    ) => void = () => {},
  ) => {
    // @ts-expect-error
    dictCallback[`fx${reqid}`] = next;

    const sMsg = JSON.stringify({
      ...msg,
      reqid: msg.type === 'ping' ? 0 : reqid++,
    });

    _send(sMsg, msg.type === 'ping');
    if (!messageResultTimeoutId) {
      messageResultTimeoutId = window.setTimeout(() => {
        if (ws?.readyState !== WebSocketReadyState.Open) {
          // The socket knows it isn't connected.
          return;
        }
        closeWithCode(ws, ClientCode.MessageTimeout, 'Message Timeout');
      }, 20000);
    }
  };

  const connect = async ({ reason }: { reason: ConnectionReason }) => {
    emitter.emit('connecting');
    logConnectionInformation({
      eventName: 'connecting',
      source: 'socketConnection',
      payload: reason,
    });

    ws = new WebSocket(typeof url === 'string' ? url : url());

    // Handles messages received from the server. The most important part of this function is finding the matching
    // callback function based on the reqid, and calling the callback with the result/error. This function also
    // adjusts the "ixLastUpdate" for the model, so that we can fetch deltas from the server when unsubscribing
    // and resubscribing to models over extended periods of time.
    const handleMessage = (msg: ServerMessage) => {
      let next;

      // For timeout clear, we don't really care if it's the same one, just that the server is alive
      if (messageResultTimeoutId) {
        window.clearTimeout(messageResultTimeoutId);
        messageResultTimeoutId = null;
      }

      if (msg === '') {
        return;
      }

      if ('reqid' in msg) {
        next = dictCallback[`fx${msg.reqid}`];
        // delete the message before calling next so that other code does not call the same function
        delete dictCallback[`fx${msg.reqid}`];
      }

      if ('result' in msg) {
        if (typeof next === 'function') {
          next(null, msg.result);
        }
        return;
      }

      if ('error' in msg) {
        if (typeof next === 'function') {
          next(msg.error);
        }
        return;
      }

      if ('notify' in msg && msg.notify.event) {
        if (msg.idModelChannel && msg.ixLastUpdateChannel) {
          subscriptionManager.setIxLastUpdate(
            msg.idModelChannel,
            msg.ixLastUpdateChannel,
          );
        }
        realtimeUpdaterEvents.trigger(msg.notify.event, {
          idModelChannel: msg.idModelChannel,
          ...msg.notify,
        });
      }
    };

    const _cancelPingMonitoring = () => {
      if (ping.rafId.value >= 0) {
        cancelAnimationFrame(ping.rafId.value);
        ping.rafId = { value: -1 };
        ping.lastTimestamp = null;
      }
    };

    const _startMonitoringPing = () => {
      /**
       * Use requestAnimationFrame to monitor whether the ping timeout
       * has passed. If it has, close the socket.
       */
      ping.rafId = startPingMonitoring({
        onTimeout: () => {
          logConnectionInformation({
            source: 'websocket',
            eventName: '🏓 Ping timed out',
          });
          closeWithCode(ws, ClientCode.PingTimeout, 'Ping Timeout');
        },
        timeoutDuration: connectionConfig.getClientPingTimeout(),
      });
    };

    /**
     * If the client attempts to send a message to the server before the connection is established, the message will be
     * buffered. Buffered messages will be sent to the server upon successful connection.
     */
    const flushBuffer = () => {
      const buf = buffer;
      buffer = [];
      buf.map((data) => _send(data));
    };

    let connectionAckTimeout: ReturnType<typeof setTimeout>;

    let websocketOpenTimeout: number = -1;

    /**
     * Handles the "open" event of the WebSocket. In response to the socket being opened, we trigger a ping message to
     * the server. Once the ping is acknowledged by the server, we consider the socket "connected". This means it is
     * ready to start sending messages to the server. If the ping is not acknowledged by the server within 15 seconds,
     * the socket is closed with the ConnectionAcknowledgementTimeout code (4507). This usually means the server is under
     * pressure, or the user's internet is flaky/slow.
     */
    const onOpen = () => {
      clearTimeout(websocketOpenTimeout);
      emitter.emit('opened', ws!);
      send({ type: 'ping' });

      if (connectionAckWaitTimeout > 0) {
        connectionAckTimeout = setTimeout(() => {
          closeWithCode(
            ws,
            ClientCode.ConnectionAcknowledgementTimeout,
            'Connection Acknowledgement Timeout',
          );
        }, connectionAckWaitTimeout);
      }
      logConnectionInformation({
        source: 'websocket',
        eventName: 'WebSocket Opened',
      });

      if (connectedOnce) {
        realtimeUpdaterEvents.trigger('reconnect');
        if (messageResultTimeoutId) {
          window.clearTimeout(messageResultTimeoutId);
          messageResultTimeoutId = null;
        }
      }
    };

    let acknowledged = false;
    const onMessage = (event: MessageEvent) => {
      if (ws?.readyState !== WebSocketReadyState.Open) {
        // Client is not ready to accept any messages
        return;
      }
      const message = parseMessage(event);
      emitter.emit('message', message);

      if (acknowledged && event.data === '') {
        ping.lastTimestamp = Date.now();
        // This looks like a ping from the server, so we can reset the ping timeout
        emitter.emit('ping', true);
        try {
          ws.send('');
        } catch (err) {
          Analytics.sendOperationalEvent({
            source: 'network:socketRpc',
            actionSubject: 'socketPing',
            action: 'failed',
            attributes: {
              message: (err as Error)?.message,
              name: (err as Error)?.name,
            },
          });
        }
        return;
      }

      let parsedData: ServerMessage | undefined;

      try {
        parsedData = parseMessage(event.data);
        handleMessage(parsedData);
      } catch (error) {
        // noop
      }

      if (!parsedData) {
        return;
      }

      if (acknowledged) {
        return;
      }

      const connectionAcknowledgedMessage =
        parsedData as ServerConnectionAckMessage;

      if (event.data === '' || connectionAcknowledgedMessage.reqid !== 0) {
        // We mainly have this here to avoid confusion when unit testing. If the connection is opened, but never
        // acknowledged, and we try to mock data being sent from the server, then this will throw and force us to update
        // the unit tests.
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(
            'First message cannot be before connection acknowledgement.',
          );
        }
      }

      if (connectionAcknowledgedMessage?.reqid !== 0) {
        return;
      }

      // This is the connection acknowledgement message from the server, so we can start the ping timeout. If we
      // don't initialize the ping timeout when we see this message, it means we can get into a situation where the
      // connection is broken, but reported as "connected".
      if (connectionAcknowledgedMessage.result !== true) {
        closeWithCode(
          ws,
          ClientCode.ConnectionAcknowledgementError,
          'Connection Acknowledgement Error',
        );
      } else {
        clearTimeout(connectionAckTimeout);
        acknowledged = true;
        emitter.emit('connected', ws!);
        ping.lastTimestamp = Date.now();
        _startMonitoringPing();

        connectedOnce = true;
        flushBuffer();

        handleMessage(parsedData);
      }
    };

    let callbackAlreadyRun = false;
    const onErrorOrClose = (errOrCloseEvent: CloseEvent | Event) => {
      clearTimeout(websocketOpenTimeout);

      if (callbackAlreadyRun) {
        return;
      }
      callbackAlreadyRun = true;

      if (isCloseEvent(errOrCloseEvent)) {
        emitter.emit('closed', errOrCloseEvent);
      } else {
        emitter.emit('error', errOrCloseEvent);
      }

      if (ws !== null) {
        ws.onclose = null;
        ws.onerror = null;
        ws.onmessage = null;
        ws.onopen = null;
        ws = null;
      }

      if (messageResultTimeoutId) {
        window.clearTimeout(messageResultTimeoutId);
        messageResultTimeoutId = null;
      }
      Object.values(dictCallback).map((next) => next?.('disconnected'));
      dictCallback = {};
      // We need to set the request ID back to 1 because we're re-establishing the socket connection.
      reqid = 1;

      _cancelPingMonitoring();

      /**
       * The shouldRetry option should encompass errors that are terminal to reconnecting
       * to sockets. Note that when you establish a socket connection the first time, we
       * do not check shouldRetry.
       */
      if (!shouldRetry?.(errOrCloseEvent)) {
        return;
      }

      return retryWait(errOrCloseEvent).then(() =>
        connect({ reason: 'delayed' }),
      );
    };

    /**
     * If you initiate a socket connection without internet (simulating 100% loss)
     * then the socket will try to connect for 20-60 seconds, without ever triggering
     * the onopen event. As a result, the internal websocket implementation will throw
     * an error, and we will not know how to handle the error since it contains no information
     * about why the error occurred. Therefore, we set a timeout here to close the socket with
     * a specific code, which allows consumers of createSocketConnection to handle the close
     * code as they see fit. This really is equivalent to getting a connection ack error or
     * timeout, since server going down might mean that we fall into this case here.
     */
    websocketOpenTimeout = window.setTimeout(() => {
      onErrorOrClose(
        new CloseEvent('close', {
          code: ClientCode.ConnectionInitiationTimeout,
        }),
      );
    }, connectionInitiationTimeout);

    ws.onopen = onOpen;
    ws.onmessage = onMessage;
    ws.onerror = onErrorOrClose;
    ws.onclose = onErrorOrClose;
  };

  connect({ reason: 'initialization' });

  return {
    buffer,
    on: emitter.on,
    send,
    resync,
    terminate(code?: number, reason?: string) {
      ws?.close(code, reason);
    },
    subscribe(
      modelType: ClientSubscribeMessage['modelType'],
      idModel: ClientSubscribeMessage['idModel'],
      tags: ClientSubscribeMessage['tags'],
      next?: (err: SubscriptionError, ixLastUpdate: number) => void,
    ) {
      const traceId = Analytics.startTask({
        taskName: 'create-subscription/socket',
        source: 'network:socket',
        attributes: {
          modelType,
          idModel,
          tags,
        },
      });
      send(
        {
          type: 'subscribe',
          modelType,
          idModel,
          tags,
          invitationTokens: getInvitationTokens()?.split(',') ?? [],
        },
        (err, ixLastUpdate) => {
          if (err) {
            Analytics.taskFailed({
              traceId,
              taskName: 'create-subscription/socket',
              source: 'network:socket',
              error: err,
            });
            Analytics.sendOperationalEvent({
              actionSubject: 'socketSubscribe',
              action: 'errored',
              source: 'network:socketRpc',
              attributes: {
                error: err,
              },
            });
            if (!subscriptionManager.isInvalidModelError(err)) {
              // Our delegate doesn't know how to handle this error
              // Consider the socket bad and disconnect.
              Analytics.sendOperationalEvent({
                actionSubject: 'socketSubscribe',
                action: 'disconnected',
                source: 'network:socketRpc',
                attributes: {
                  error: err,
                },
              });
              closeWithCode(
                ws,
                ClientCode.SubscriptionError,
                'Subscription Error',
              );
            }
          } else {
            Analytics.taskSucceeded({
              traceId,
              taskName: 'create-subscription/socket',
              source: 'network:socket',
            });
            // If the ixLastUpdate has changed, resync and let that response set ixLastUpdate
            const storedIxLastUpdate =
              subscriptionManager.getIxLastUpdate(idModel);
            if (
              storedIxLastUpdate !== undefined &&
              storedIxLastUpdate !== -1 &&
              storedIxLastUpdate !== ixLastUpdate
            ) {
              resync({
                idModel,
                onSyncError: () => {
                  closeWithCode(ws, ClientCode.ResyncError, 'Resync Error');
                },
              });
            } else {
              subscriptionManager.setIxLastUpdate(idModel, +ixLastUpdate);
            }
          }

          return next?.(err, +ixLastUpdate);
        },
      );
    },
    unsubscribe(
      modelType: 'Board' | 'Enterprise' | 'Member' | 'Organization',
      idModel: string,
      next?: Callback,
    ) {
      send(
        {
          type: 'unsubscribe',
          modelType,
          idModel,
        },
        (err, response) => {
          return typeof next === 'function' ? next(err, response) : undefined;
        },
      );
    },
  };
}
