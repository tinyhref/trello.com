import type { WebSocketState } from './webSocketState';

// This function is implemented in a bit of an odd way. This is to ensure that whenever we add or remove WebSocketState
// values, that this function also needs to be updated. If they don't get added here, we will get type errors.
export function isValidReconnectionState(state: WebSocketState): boolean {
  // eslint-disable-next-line default-case
  switch (state) {
    case 'force_disconnected':
    case 'rate_limited':
    case 'too_far_behind':
    case 'reconnections_blocked':
    case 'connected':
      return false;
    case 'closed':
    case 'connecting':
    case 'disconnected':
    case 'waiting_to_reconnect':
      return true;
  }
}
