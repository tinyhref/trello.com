import type { RouteDefinition } from '@trello/router/routes';
import { getRouteIdFromPathname } from '@trello/router/routes';

export const isCurrentRoute = (route: RouteDefinition) => {
  return getRouteIdFromPathname(window.location.pathname) === route.id;
};
