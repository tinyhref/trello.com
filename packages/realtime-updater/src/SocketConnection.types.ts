export type ConnectionReason =
  | 'delayed'
  | 'initialization'
  | 'internetRestored'
  | 'manualRetryFromRedbox'
  | 'reopen'
  | 'userBecameActive'
  | 'wakeFromSleep';

/**
 * The reconnect logic depends on how the WebSockets connection was terminated. In
 * particular, was the close expected or unexpected.
 *
 * If it's an **expected close**, the WebSockets server will send a
 * [WebSocket status code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent)
 * that allows the client to reconnect immediately. The expected close
 * codes represent the final status and reason for closing the connection,
 * typically designating what the client needs to do.
 *
 * @link {https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1}
 */

export const ServerCode = {
  /**
   * This is the normal close case and the client can reconnect immediately.
   */
  Normal: 1000,

  /**
   * Server is shutting down, probably due to a redeploy of some sort
   */
  GoingAway: 1001,

  /**
   * Indicates that an endpoint is terminating the connection due to a protocol error.
   */
  ProtocolError: 1002,

  /**
   * Endpoint is terminating the connection
   * because it has received a type of data it cannot accept
   */
  InvalidData: 1003,

  /**
   * Don't think this one means anything
   */
  Reserved: 1004,

  /**
   * Closed no status. Expected close status, received none.
   */
  ClosedNoStatus: 1005,

  /**
   * 1006 is a reserved value and MUST NOT be set as a status code in a
   * Close control frame by an endpoint.  It is designated for use in
   * applications expecting a status code to indicate that the
   * connection was closed abnormally, e.g., without sending or
   * receiving a Close control frame.
   */
  Abnormal: 1006,

  /**
   * Indicates that an endpoint is terminating the connection
   * because it has received data within a message that was not
   * consistent with the type of the message
   */
  InconsistentData: 1007,

  /**
   * The client's authentication is invalid. The client needs to validate the authentication credentials in some other
   * way and if that succeeds, try reconnecting again.
   */
  PolicyViolation: 1008,

  /**
   * Indicates that an endpoint is terminating the connection
   * because it has received a message that is too big for it to process.
   */
  DataTooLarge: 1009,

  /**
   * Client wanted an extension which server did not negotiate
   */
  MandatoryExtension: 1010,

  /**
   * Internal server error occurred.
   */
  ServerError: 1011,

  /**
   * @linkcode {ServerCode.GoingAway}
   * Same as above. Server is shutting down, probably due to a redeploy of some sort
   */
  ServerRestart: 1012,

  /**
   * 	Temporary server condition forced blocking client's request
   */
  TryAgainLater: 1013,

  /**
   * Server acting as gateway received an invalid response
   */
  BadGateway: 1014,

  /**
   * Transport Layer Security handshake failure
   */
  TLSHandshakeFailed: 1015,

  /**
   * The client needs to close the WebSocket connection and delay reconnection. This is the ONLY case when the client
   * gets back the reconnect delay, which typically ranges from 10 to 15 seconds of "waiting".
   */
  DelayReconnect: 4000,

  /**
   * The client should close the WebSocket connection without trying to reconnect. Currently, this status code is not
   * frequently sent and is stored for some future improvements.
   */
  DisableReconnect: 4001,

  /**
   * The client's token has expired, and they need to re-authenticate.
   */
  TerminatedSession: 4002,
} as const;
export type ServerCodeValue = (typeof ServerCode)[keyof typeof ServerCode];

/**
 * Client codes to be used to close the socket client side.
 */

export const ClientCode = {
  SubscriptionError: 4501,
  PingTimeout: 4502,
  MessageTimeout: 4503,
  InternetUnhealthy: 4504,
  ErrorSendingMessage: 4506,
  ConnectionAcknowledgementTimeout: 4507,
  ConnectionAcknowledgementError: 4508,
  ResyncError: 4509,
  ConnectionInitiationTimeout: 4511,
} as const;
export type ClientCodeValue = (typeof ClientCode)[keyof typeof ClientCode];

/**
 * RequestId is a number type alias representing
 * the globally unique ID used for identifying
 * messages sent by the client.
 */
export type RequestId = number;

// Types of messages allowed to be sent by the client/server over the WS protocol.
export type MessageType = 'ping' | 'subscribe' | 'unsubscribe';

export type Tag = 'allActions' | 'clientActions' | 'pluginData' | 'updates';

interface BaseClientMessage {
  /**
   * An integer ID for the message that is unique to the connection.
   */
  readonly reqid: RequestId;

  /**
   * The type of the message the client is sending to the server.
   *   - `subscribe`. Subscribe to any number of tags for a given model.
   *   - `unsubscribe`. Unsubscribe from some or all tags for a given model.
   *   - `ping`. Check the WebSocket connection state.
   */
  readonly type: MessageType;
}

export interface ClientPingMessage extends BaseClientMessage {
  readonly reqid: RequestId;
  readonly type: 'ping';
}

export type ClientKeepAliveMessage = '';

interface BaseClientSubscribeMessage {
  readonly type: 'subscribe';
  // An identifier created by the client so that messages from server can be matched to those sent by the client.
  readonly reqid: RequestId;
  // The type of model to which the client is subscribing (organization, board, or member).
  readonly modelType: 'Board' | 'Enterprise' | 'Member' | 'Organization';
  // The ID of the model to which the client is subscribing.
  readonly idModel: string;
  // Used for authorization and filtering of channels the client receives updates on.
  readonly tags: Tag[];
  // This field is optional. It includes a list of invitation token strings.
  readonly invitationTokens?: string[];
}

export interface ClientBoardSubscribeMessage
  extends BaseClientSubscribeMessage {
  readonly modelType: 'Board';
  readonly tags: ('allActions' | 'clientActions' | 'pluginData' | 'updates')[];
}

export interface ClientMemberSubscribeMessage
  extends BaseClientSubscribeMessage {
  readonly modelType: 'Member';
  readonly tags: ('allActions' | 'pluginData' | 'updates')[];
}

export interface ClientOrganizationSubscribeMessage
  extends BaseClientSubscribeMessage {
  readonly modelType: 'Organization';
  readonly tags: ('allActions' | 'pluginData' | 'updates')[];
}

export interface ClientEnterpriseSubscribeMessage
  extends BaseClientSubscribeMessage {
  readonly modelType: 'Enterprise';
  readonly tags: ('allActions' | 'pluginData' | 'updates')[];
}

interface BaseClientUnsubscribeMessage extends BaseClientMessage {
  readonly modelType: 'Board' | 'Enterprise' | 'Member' | 'Organization';

  // The ID of the model from which the client is unsubscribing.
  readonly idModel: string;

  // This field is optional. If no value is provided, the server  unsubscribes the client from all tags.
  readonly tags?: Tag[];

  readonly type: 'unsubscribe';
}

export interface ClientBoardUnsubscribeMessage
  extends BaseClientUnsubscribeMessage {
  readonly modelType: 'Board';
  readonly tags?: ClientBoardSubscribeMessage['tags'];
}

export interface ClientMemberUnsubscribeMessage
  extends BaseClientUnsubscribeMessage {
  readonly modelType: 'Member';
  readonly tags?: ClientMemberSubscribeMessage['tags'];
}

export interface ClientOrganizationUnsubscribeMessage
  extends BaseClientUnsubscribeMessage {
  readonly modelType: 'Organization';
  readonly tags?: ClientOrganizationSubscribeMessage['tags'];
}

export interface ClientEnterpriseUnsubscribeMessage
  extends BaseClientUnsubscribeMessage {
  readonly modelType: 'Enterprise';
  readonly tags?: ClientEnterpriseSubscribeMessage['tags'];
}

export type ClientSubscribeMessage =
  | ClientBoardSubscribeMessage
  | ClientEnterpriseSubscribeMessage
  | ClientMemberSubscribeMessage
  | ClientOrganizationSubscribeMessage;

export type ClientUnsubscribeMessage =
  | ClientBoardUnsubscribeMessage
  | ClientEnterpriseUnsubscribeMessage
  | ClientMemberUnsubscribeMessage
  | ClientOrganizationUnsubscribeMessage;

export type ClientMessage =
  | ClientKeepAliveMessage
  | ClientPingMessage
  | ClientSubscribeMessage
  | ClientUnsubscribeMessage;

interface BaseServerMessage {
  /**
   * After the server has processed the client’s message, it always returns the same
   * `reqid` parameter in its response message to the client. `reqid` value is a
   * unique, incremented integer that is used to match up the requests and responses.
   * `reqid` is never the same for requests that come for the same WebSocket
   * connection.
   */
  readonly reqid: RequestId;

  /**
   * The result of processing the incoming message.
   */
  readonly result: boolean | number;
}

export type ServerConnectionAckMessage = BaseServerMessage;

export type ServerKeepAliveMessage = '';

export interface ServerSubscribeMessage extends BaseServerMessage {
  // An integer that specifies the `ixLastUpdate` for the model to which the client subscribed.
  readonly result: number;
}

export type ServerUnsubscribeMessage = BaseServerMessage;

/**
 * The WebSockets server notifies the web client that a particular model (the client is subscribed to) has been updated.
 */
export interface ServerUpdateModelMessage {
  readonly idModelChannel: string;
  readonly ixLastUpdateChannel: number;
  readonly notify: {
    readonly event: 'updateModels';
  };
}

/**
 * The WebSockets server notifies the web client that a particular model (th client is subscribed to) has been deleted.
 */
export interface ServerDeleteModelMessage {
  readonly idModelChannel: string;
  readonly ixLastUpdateChannel: number;
  readonly notify: {
    readonly event: 'deleteModels';
  };
}

export interface ServerErrorMessage {
  readonly reqid: RequestId;
  readonly error: string;
}

// export interface ServerInvalidModelMessage {
//   readonly notify: {
//     readonly event: 'invalidModel';
//   };
// }
//
// export interface ServerInvalidSubscriptionMessage extends BaseServerMessage {
//   readonly notify: {
//     readonly event: 'subscription_invalid';
//   };
// }

export type ServerMessage =
  | ServerConnectionAckMessage
  | ServerDeleteModelMessage
  | ServerErrorMessage
  | ServerKeepAliveMessage
  | ServerSubscribeMessage
  | ServerUnsubscribeMessage
  | ServerUpdateModelMessage;
// | ServerInvalidModelMessage
// | ServerInvalidSubscriptionMessage

// WebSocket started connecting.
export type EventConnecting = 'connecting';

// WebSocket has opened.
export type EventOpened = 'opened';

// Open WebSocket connection has been acknowledged by the server.
export type EventConnected = 'connected';

// `PingMessage` has been received or sent.
export type EventPing = 'ping';

// `PongMessage` has been received or sent.
export type EventPong = 'pong';

// A message has been received.
export type EventMessage = 'message';

// WebSocket connection has closed.
export type EventClosed = 'closed';

// WebSocket connection had an error or client had an internal error.
export type EventError = 'error';

// All events that could occur.
export type SocketEvent =
  | EventClosed
  | EventConnected
  | EventConnecting
  | EventError
  | EventMessage
  | EventOpened
  | EventPing
  | EventPong;

export type EventConnectingListener = () => void;

export type EventOpenedListener = (socket: WebSocket) => void;

export type EventConnectedListener = (socket: WebSocket) => void;

/**
 * The first argument communicates whether the ping was received from the server.
 * If `false`, the ping was sent by the client.
 */
export type EventPingListener = (received: boolean) => void;

/**
 * The first argument communicates whether the pong was received from the server.
 * If `false`, the pong was sent by the client.
 */
export type EventPongListener = (received: boolean) => void;

/**
 * Called for all **valid** messages received by the client. Mainly useful for
 * debugging and logging received messages.
 */
export type EventMessageListener = (message: ServerMessage) => void;

export type EventClosedListener = (event: CloseEvent) => void;

/**
 * Events dispatched from the WebSocket `onerror` are handled in this listener,
 * as well as all internal client errors that could throw.
 */
export type EventErrorListener = (error: unknown) => void;

export type EventListener<TEvent extends SocketEvent> =
  TEvent extends EventConnecting
    ? EventConnectingListener
    : TEvent extends EventOpened
      ? EventOpenedListener
      : TEvent extends EventConnected
        ? EventConnectedListener
        : TEvent extends EventPing
          ? EventPingListener
          : TEvent extends EventPong
            ? EventPongListener
            : TEvent extends EventMessage
              ? EventMessageListener
              : TEvent extends EventClosed
                ? EventClosedListener
                : TEvent extends EventError
                  ? EventErrorListener
                  : never;
