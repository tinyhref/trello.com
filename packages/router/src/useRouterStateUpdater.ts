import { useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';

import type { RouteIdType } from '@trello/router/routes';
import { getRouteIdFromPathname } from '@trello/router/routes';

import { getRouteParamsFromPathname } from './getRouteParamsFromPathname';
import type { RouterState } from './routerState';
import { routerState } from './routerState';

export function useRouterStateUpdater(): void {
  const routerRef = useRef(routerState.value);

  useEffect(() => {
    function handleHistoryChange() {
      const { pathname, search, hash, hostname, origin } = window.location;
      const nextLocation = { pathname, search, hash, hostname, origin };
      const nextRoute = {
        id: getRouteIdFromPathname(pathname),
        params: getRouteParamsFromPathname(
          pathname,
        ) as RouterState<RouteIdType>['params'],
        location: nextLocation,
        options: history.state,
      };

      if (isEqual(routerRef.current, nextRoute)) {
        return;
      }

      routerState.setValue(nextRoute);
      routerRef.current = {
        ...routerRef.current,
        ...nextRoute,
      };
    }

    window.addEventListener('pushstate', handleHistoryChange);
    window.addEventListener('replacestate', handleHistoryChange);
    window.addEventListener('popstate', handleHistoryChange);

    return () => {
      window.removeEventListener('pushstate', handleHistoryChange);
      window.removeEventListener('replacestate', handleHistoryChange);
      window.removeEventListener('popstate', handleHistoryChange);
    };
  }, []);
}
