import { useCallback } from 'react';

import { useSharedStateSelector } from '@trello/shared-state';

import { routerState } from './routerState';

export const usePathname = (): string => {
  const pathname = useSharedStateSelector(
    routerState,
    useCallback((state) => state.location.pathname, []),
  );
  return pathname;
};
