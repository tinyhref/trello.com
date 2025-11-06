import { SharedState } from '@trello/shared-state';

import type {
  GenericEvent,
  GraphQLWebsocketEvent,
  GraphQLWebsocketLinkEvent,
  PollingConnectionEvent,
  RealtimeUpdaterEvent,
  SocketConnectionEvent,
  WebsocketEvent,
  WebSocketStateEvent,
} from './logConnectionInformation';

export type ConnectionEvent =
  | GenericEvent
  | GraphQLWebsocketEvent
  | GraphQLWebsocketLinkEvent
  | PollingConnectionEvent
  | RealtimeUpdaterEvent
  | SocketConnectionEvent
  | WebsocketEvent
  | WebSocketStateEvent;

export const connectionInformationState = new SharedState<{
  eventLog: ConnectionEvent[];
  eventLogLimit: number;
}>({
  eventLog: [],
  eventLogLimit: 500,
});
