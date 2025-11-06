import { isTerminalWebSocketState } from './isTerminalWebSocketState';
import type { WebSocketState } from './webSocketState';
import { webSocketState } from './webSocketState';

/**
 * Only allow the websocket state to be transitioned to valid states.
 * For example, if we are redboxed, or some other state, we should not allow you to
 * transition to closed.
 */
export function safelyUpdateWebSocketState(nextState: WebSocketState) {
  // If we are in a terminal state, we are not allowed to update the webSocketState
  if (!isTerminalWebSocketState(webSocketState.value)) {
    webSocketState.setValue(nextState);
  }
}
