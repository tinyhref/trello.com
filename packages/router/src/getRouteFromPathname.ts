import type { RouteIdType, Routes } from '@trello/router/routes';
import {
  getRouteIdFromPathname,
  routeDefinitions,
} from '@trello/router/routes';

import type { RouterState } from './routerState';

export function getRouteFromPathname<T extends RouteIdType>(
  pathname: string,
): Pick<RouterState<T>, 'id' | 'params'> {
  const routeId = getRouteIdFromPathname(pathname);
  const route = routeDefinitions[routeId];

  return {
    id: routeId,
    params: route.getRouteParams(pathname) as ReturnType<
      Routes[T]['getRouteParams']
    >,
  };
}
