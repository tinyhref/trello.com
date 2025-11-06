import { SharedState } from '@trello/shared-state';

export type WebSocketState =
  | 'closed'
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'force_disconnected'
  | 'rate_limited'
  | 'reconnections_blocked'
  | 'too_far_behind'
  | 'waiting_to_reconnect';

/**
 * Shared state that broadcasts the current ws state
 */
export const webSocketState = new SharedState<WebSocketState>('disconnected');
