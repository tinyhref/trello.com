import { useEffect } from 'react';

import type { RouterState } from '@trello/router';
import { isActiveRoute, routerState } from '@trello/router';
import { RouteId } from '@trello/router/routes';
import type {
  BoardButlerViewParams,
  BoardCalendarPupViewParams,
  BoardCalendarViewParams,
  BoardDashboardViewParams,
  BoardMapViewParams,
  BoardPowerUpsViewParams,
  BoardPowerUpViewParams,
  BoardTableViewParams,
  BoardTimelineViewParams,
  BoardViewParams,
  BoardViews,
} from '@trello/router/routes';
import { SharedState } from '@trello/shared-state';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<T, TKey extends keyof any> = T extends any
  ? Omit<T, TKey>
  : never;

export type BoardPrimaryViewParams =
  | BoardCalendarViewParams
  | BoardDashboardViewParams
  | BoardMapViewParams
  | BoardTableViewParams
  | BoardTimelineViewParams
  | BoardViewParams;

export type BoardSecondaryViewParams =
  | BoardButlerViewParams
  | BoardCalendarPupViewParams
  | BoardPowerUpsViewParams
  | BoardPowerUpViewParams;

export interface BoardPageState {
  primaryViewParams: DistributiveOmit<
    BoardPrimaryViewParams,
    'shortLink' | 'shortName'
  > | null;
  secondaryViewParams: DistributiveOmit<
    BoardSecondaryViewParams,
    'shortLink' | 'shortName'
  > | null;
  isShowingOverlay: boolean | null;
}

function isPrimaryBoardView(
  params: DistributiveOmit<BoardViews, 'shortLink' | 'shortName'>,
): params is DistributiveOmit<
  BoardPrimaryViewParams,
  'shortLink' | 'shortName'
> {
  const { view } = params;
  return (
    view === 'board' ||
    view === 'calendar-view' ||
    view === 'dashboard' ||
    view === 'map' ||
    view === 'table' ||
    view === 'timeline'
  );
}

function isSecondaryBoardView(
  params: DistributiveOmit<BoardViews, 'shortLink' | 'shortName'>,
): params is DistributiveOmit<
  BoardSecondaryViewParams,
  'shortLink' | 'shortName'
> {
  const { view } = params;
  return (
    view === 'butler' ||
    view === 'calendar' ||
    view === 'power-ups' ||
    view === 'power-up'
  );
}

export const boardPageState = new SharedState<BoardPageState>({
  primaryViewParams: null,
  secondaryViewParams: null,
  isShowingOverlay: null,
});

/**
 * Preserves the primary (e.g. board, timeline) and secondary (e.g. butler, power-ups) board view when
 * moving between boards and cards. This allows us to correctly navigate back to the previous view when
 * overlays are closed, or when closing a secondary board view.
 *
 * When a user navigates away from a board or card entirely, these values will be reset to
 * their defaults and will not be restored when returning to the board or card.
 *
 * **Definitions**
 *  - Primary Board View: a view that is presented in the board view switcher on the left of the board
 *    header (e.g. Calendar, Dashboard, Table, Timeline)
 *  - Secondary Board View: a view that is presented on the right of the board header (e.g. Butler,
 *    Power-Ups). Secondary views often look like primary views, but also have a close button to return
 *    to the primary view.
 *  - Overlay: a view that is presented on top of the board (e.g. Card Back, Member Activity). Closing an
 *    overlay will return to the secondary board view (if there was one). If there was no secondary board
 *    view, then the primary board view will be returned to. If there was no primary board view, then the
 *    "board" view will be returned to by default.
 */
export const useBoardPageState = () => {
  useEffect(() => {
    /**
     * Use route listener to avoid state changes in Board.tsx where this hook is used.
     */
    const updateState = (
      state: RouterState<typeof RouteId.BOARD | typeof RouteId.CARD>,
    ) => {
      const route = { id: state.id, params: state.params };

      if (isActiveRoute(route, RouteId.BOARD)) {
        const searchParams = new URLSearchParams(state.location.search);

        // We don't want to persist all views from the route onto the board page state. If the view is more like
        // an overlay (e.g. Butler, Power-Ups and Member Activity) then we don't want to persist it. We only want
        // to persist views that are more like a page (e.g. Calendar, Dashboard, Table, Timeline). This allows us
        // to correctly navigate back to the previous view when overlays are closed, or when navigating back to
        // a card.
        const { shortLink, shortName, ...params } = route.params;
        if (isPrimaryBoardView(params)) {
          boardPageState.setValue({
            isShowingOverlay: searchParams.get('overlay') !== null,
            primaryViewParams: params,
            secondaryViewParams: null,
          });
        } else if (isSecondaryBoardView(params)) {
          boardPageState.setValue({
            isShowingOverlay: searchParams.get('overlay') !== null,
            secondaryViewParams: params,
          });
        } else {
          boardPageState.setValue({
            isShowingOverlay: true,
          });
        }
      } else if (isActiveRoute(route, RouteId.CARD)) {
        boardPageState.setValue({
          isShowingOverlay: true,
        });
      }
    };

    const unsubscribe = routerState.subscribe(updateState);

    updateState(routerState.value);

    return () => {
      unsubscribe();
      boardPageState.reset();
    };
  }, []);
};
