import { useCallback } from 'react';

import type { RouteIdType } from '@trello/router/routes';
import { useSharedStateSelector } from '@trello/shared-state';

import { routerState } from './routerState';

/**
 * Utility hook that returns a boolean for whether the route is active.
 * This is more performant than using useRouteId because it will not cause
 * rerenders on apps where route changes occur. For example, if you do
 * const isBoardRoute = useIsActiveRoute(RouteId.BOARD);
 * it will only rerender when you go from True to False or False to True.
 * However, if you use
 * const routeId = useRouteId();
 * const isBoardRoute = routeId === RouteId.BOARD;
 * then you will get rerenders on every route change.
 * @param routeIdOrIds - The route id or ids to check.
 * @returns boolean
 */
export function useIsActiveRoute(
  routeIdOrIds: RouteIdType | Set<RouteIdType>,
): boolean {
  return useSharedStateSelector(
    routerState,
    useCallback(
      (route) => {
        if (typeof routeIdOrIds === 'string') {
          return route.id === routeIdOrIds;
        } else {
          return routeIdOrIds.has(route.id);
        }
      },
      [routeIdOrIds],
    ),
  );
}
