import { useCallback } from 'react';

import type { BackboneHistoryNavigateOptions } from '@trello/router/legacy-router';
import { useSharedStateSelector } from '@trello/shared-state';

import { routerState } from './routerState';

/**
 * Hook that retrieves the current navigation options from the router state.
 * These options contain metadata about how the current navigation was triggered.
 *
 * @returns The navigation options ({@link BackboneHistoryNavigateOptions}) from {@link routerState} if available, or undefined if no options were set.
 */
export function useNavigateOptions():
  | BackboneHistoryNavigateOptions
  | undefined {
  const options = useSharedStateSelector(
    routerState,
    useCallback((route) => route.options, []),
  );
  return options;
}
