import { useCallback } from 'react';

import type { RouteIdType } from '@trello/router/routes';
import { useSharedStateSelector } from '@trello/shared-state';

import type { RouterState } from './routerState';
import { routerState } from './routerState';

/**
 * Utility hook to get the parameters for a given route.
 * @returns Parameters for route
 */
export function useRouteParams<
  T extends RouteIdType,
>(): RouterState<T>['params'] {
  const params = useSharedStateSelector(
    routerState,
    useCallback((route) => route.params as RouterState<T>['params'], []),
  );
  return params;
}
