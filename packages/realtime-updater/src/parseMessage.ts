import type { ServerMessage } from './SocketConnection.types';

// Parses the raw websocket message data to a valid message.
export function parseMessage(data: unknown): ServerMessage {
  return typeof data === 'string' && data !== ''
    ? JSON.parse(data)
    : (data as ServerMessage);
}
