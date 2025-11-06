import { developerConsoleState } from '@trello/developer-console-state';

import { connectionInformationState } from './connectionInformationState';
export interface ConnectionInformationEvent {
  eventName: string;
  payload?: object | string;
  timestamp?: number;
}

export interface PollingConnectionEvent extends ConnectionInformationEvent {
  source: 'pollingConnection';
}

export interface SocketConnectionEvent extends ConnectionInformationEvent {
  source: 'socketConnection';
}

export interface RealtimeUpdaterEvent extends ConnectionInformationEvent {
  source: 'realtimeUpdater';
}

export interface GraphQLWebsocketLinkEvent extends ConnectionInformationEvent {
  source: 'graphqlWebsocketLink';
}

export interface GraphQLWebsocketEvent extends ConnectionInformationEvent {
  source: 'graphqlWebsocket';
}

export interface WebsocketEvent extends ConnectionInformationEvent {
  source: 'websocket';
}

export interface WebSocketStateEvent extends ConnectionInformationEvent {
  source: 'webSocketState';
}

export interface GenericEvent extends ConnectionInformationEvent {
  source: 'generic';
}

export function logConnectionInformation(
  event:
    | GenericEvent
    | GraphQLWebsocketEvent
    | GraphQLWebsocketLinkEvent
    | PollingConnectionEvent
    | RealtimeUpdaterEvent
    | SocketConnectionEvent
    | WebsocketEvent
    | WebSocketStateEvent,
) {
  const shouldLog = developerConsoleState.value.logConnectionInformation;
  if (shouldLog) {
    connectionInformationState.setValue({
      eventLog: [
        {
          ...event,
          timestamp: Date.now(),
        },
        // Slice the array so we don't exceed the event log limit. This helps avoid every-increasing memory usage.
        ...connectionInformationState.value.eventLog.slice(
          0,
          connectionInformationState.value.eventLogLimit - 1,
        ),
      ],
    });
  }
}
