import type { GraphqlWebsocketState } from './graphqlWebsocketState';
import { graphqlWebsocketState } from './graphqlWebsocketState';

export function safelyUpdateGraphqlWebsocketState(
  state: GraphqlWebsocketState,
) {
  /**
   * We don't have any terminal values yet for the graphql websocket state, such as
   * rate_limited, reconnection_blocked, too_far_behind for the legacy
   * websocket state, but when we do we should check for them here.
   */

  if (state === 'not_initialized') {
    // This state is only for before the websocket is connected
    return;
  }
  graphqlWebsocketState.setValue(state);
}
