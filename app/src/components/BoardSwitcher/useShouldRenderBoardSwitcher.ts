import { isEmbeddedDocument } from '@trello/browser';
import { useIsActiveRoute } from '@trello/router';
import { RouteId, type RouteIdType } from '@trello/router/routes';

const ROUTES_BLOCKLIST = new Set<RouteIdType>([
  RouteId.CREATE_FIRST_BOARD,
  RouteId.WELCOME_TO_TRELLO,
  RouteId.REDEEM,
]);

export const useShouldRenderBoardSwitcher = () => {
  const isBlockedRoute = useIsActiveRoute(ROUTES_BLOCKLIST);
  return !isBlockedRoute && !isEmbeddedDocument();
};
