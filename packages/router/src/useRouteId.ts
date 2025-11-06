import { useCallback } from 'react';

import type { RouteIdType } from '@trello/router/routes';
import { useSharedStateSelector } from '@trello/shared-state';

import { routerState } from './routerState';

/**
 * @prefer useIsActiveRoute for better performance.
 * Utility hook to get the active route id.
 * BE CAREFUL using this hook. It can cause rerenders when navigating that are
 * unnecessary. Prefer to use useIsActiveRoute for better performance.
 * @returns RouteIdType
 */
export function useRouteId(): RouteIdType {
  const id = useSharedStateSelector(
    routerState,
    useCallback((route) => route.id, []),
  );
  return id;
}
