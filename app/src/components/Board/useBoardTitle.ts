import { useEffect } from 'react';

import { isActiveRoute, routerState, type RouterState } from '@trello/router';
import { RouteId, type RouteIdType } from '@trello/router/routes';

import { setDocumentTitle } from 'app/src/components/DocumentTitle';
import { useBoardTitleFragment } from './BoardTitleFragment.generated';

export const useBoardTitle = (boardId: string) => {
  const { data: board } = useBoardTitleFragment({
    from: { id: boardId },
  });

  useEffect(() => {
    const handleRouteChange = (route: RouterState<RouteIdType>) => {
      if (board?.name && isActiveRoute(route, RouteId.BOARD)) {
        setDocumentTitle(board?.name);
      }
    };

    const unsubscribe = routerState.subscribe(handleRouteChange);
    handleRouteChange(routerState.value);

    return () => {
      unsubscribe();
    };
  }, [board?.name]);
};
