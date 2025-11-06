import { SharedState } from '@trello/shared-state';

export type PollingState =
  | 'connected'
  | 'disconnected'
  | 'force_disconnected'
  | 'rate_limited'
  | 'terminating error response'
  | 'too_far_behind';

/**
 * Shared state that broadcasts the current ws state
 */
export const pollingState = new SharedState<PollingState>('disconnected');
