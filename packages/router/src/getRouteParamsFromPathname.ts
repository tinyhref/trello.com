import type { RouteIdType, Routes } from '@trello/router/routes';
import {
  getRouteIdFromPathname,
  routeDefinitions,
} from '@trello/router/routes';

export function getRouteParamsFromPathname<T extends RouteIdType>(
  pathname: string,
): ReturnType<Routes[T]['getRouteParams']> {
  const routeId = getRouteIdFromPathname(pathname);
  const route = routeDefinitions[routeId];

  return route.getRouteParams(pathname) as ReturnType<
    Routes[T]['getRouteParams']
  >;
}
