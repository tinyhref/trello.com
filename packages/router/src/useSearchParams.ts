import { useCallback, useMemo } from 'react';

import { useSharedStateSelector } from '@trello/shared-state';

import { routerState } from './routerState';

/**
 * Utility hook for getting URLSearchParams for a given route
 * @returns URLSearchParams
 */
export const useSearchParams = (): URLSearchParams => {
  const search = useSharedStateSelector(
    routerState,
    useCallback((state) => state.location.search, []),
  );

  return useMemo(() => new URLSearchParams(search), [search]);
};
