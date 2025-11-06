import { RouteId, type RouteIdType } from '@trello/router/routes';

import { useIsActiveRoute } from './useIsActiveRoute';

const BOARD_OR_CARD_ROUTES = new Set<RouteIdType>([
  RouteId.BOARD,
  RouteId.BOARD_REFERRAL,
  RouteId.INVITE_ACCEPT_BOARD,
  RouteId.CARD,
]);

/**
 * Returns true if the current route is a board or card route.
 * This is useful for checking if the user is on a board or card route.
 * @returns boolean
 */
export const useIsBoardOrCardRoute = () => {
  return useIsActiveRoute(BOARD_OR_CARD_ROUTES);
};
