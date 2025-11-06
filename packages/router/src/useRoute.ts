import { useCallback } from 'react';

import type { RouteIdType } from '@trello/router/routes';
import { useSharedStateSelector } from '@trello/shared-state';

import type { RouterState } from './routerState';
import { routerState } from './routerState';

/**
 * Hook to view route details.
 * id: The RouteIdType
 * params: The parameters for the given route id.
 * You should use this as a generic, with useRoute<typeof RouteId.BOARD>(); and can also expand to more
 * routes using useRoute<typeof RouteId.BOARD | typeof RouteId.CARD>();. If you are using with multiple routes,
 * you should use isActiveRoute for type safety.
 * @returns the id and params for the route
 */
export function useRoute<T extends RouteIdType>(): {
  id: RouterState<T>['id'];
  params: RouterState<T>['params'];
} {
  const route = useSharedStateSelector(
    routerState,
    useCallback(
      (value) => ({
        id: value.id,
        params: value.params as RouterState<T>['params'],
      }),
      [],
    ),
  );
  return route;
}
