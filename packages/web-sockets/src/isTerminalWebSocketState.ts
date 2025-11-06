import type { WebSocketState } from './webSocketState';

/**
 * Denotes whether the WebSocketState is currently in a "terminal" state,
 * meaning that it should not be able to transition to another state.
 * @param state WebSocketState
 * @returns Boolean
 */
export function isTerminalWebSocketState(state: WebSocketState): boolean {
  switch (state) {
    case 'force_disconnected':
    case 'rate_limited':
    case 'too_far_behind':
    case 'reconnections_blocked':
      return true;
    default:
      return false;
  }
}
