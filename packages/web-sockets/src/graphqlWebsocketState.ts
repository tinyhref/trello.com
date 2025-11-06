import { SharedState } from '@trello/shared-state';

export type GraphqlWebsocketState =
  | 'closed_by_server'
  | 'closed'
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'not_initialized'
  | 'rate_limited'
  | 'too_many_initialization_requests'
  | 'waiting_to_reconnect';

/**
 * eventually add in states like
 * reconnections_blocked, too_far_behind
 */

/**
 * Shared state that broadcasts the current graphql-ws state
 */
export const graphqlWebsocketState = new SharedState<GraphqlWebsocketState>(
  'not_initialized',
);
