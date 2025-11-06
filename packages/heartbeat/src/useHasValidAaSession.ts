import { SharedState, useSharedState } from '@trello/shared-state';

const hasValidAaSession = new SharedState(true);

/**
 * Exposes a value in state that indicates whether the user has a valid Aa
 * session, which essentially means that the user has a valid cloud session
 * token cookie. This cookie can expire or become invalidated, after which all
 * `api-gateway` requests will fail with a 401. If the cookie is missing,
 * `api-gateway` requests will fail with a 400,
 *
 * This hooks into the Heartbeat component, which polls to validate the session,
 * and updates to be falsy if that component ever hits an error itself.
 *
 * Note: this is deliberately not exported in the index file; consumers should
 * import this directly to omit @atlassian/heartbeat from their bundles.
 */
export const useHasValidAaSession = () => useSharedState(hasValidAaSession);
