import { useMemo } from 'react';

import { useLocation } from '@trello/router';
import { pathnameToRouteContext } from '@trello/router/legacy-router';

import { boardPageState } from 'app/src/components/Board/useBoardPageState';
import type { ViewType } from 'app/src/components/ViewsGenerics';

export const routeToNameMapping: { [key: string]: ViewType } = {
  'calendar-view': 'calendar',
  board: 'board',
  table: 'table',
  timeline: 'timeline',
  dashboard: 'dashboard',
  map: 'map',
};

export const useCurrentView = (): ViewType | null => {
  const location = useLocation();
  const route = useMemo(
    () => pathnameToRouteContext(`${location.pathname}${location.search}`),
    [location.pathname, location.search],
  );

  const path = route.routePath;
  const pathArgs = path.split('/');
  const currentView =
    (pathArgs.length >= 5 && pathArgs[4]?.split('?')[0]) || 'board';

  if (currentView === 'calendar') {
    return null;
  }

  return routeToNameMapping[
    boardPageState.value.primaryViewParams?.view || 'board'
  ];
};
