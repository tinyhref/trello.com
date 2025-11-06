import { isActiveRoute, routerState } from '@trello/router';
import { RouteId } from '@trello/router/routes';
import { importWithRetry } from '@trello/use-lazy-component';

const importWithRetryAndIgnoreFailures = async (
  factory: Parameters<typeof importWithRetry>[0],
) => {
  try {
    await importWithRetry(factory);
  } catch (err) {
    // noop
  }
};

/**
 * Utility hook that preloads javascript assets for the board.
 * When you load the board, we might have to wait for some time for the API
 * requests to finish in order to render. During that time, CPU is idle and we should
 * prioritize preloading these assets so that they are ready when we render.
 */
export const preloadCurrentBoardViewAssets = () => {
  const state = routerState.value;

  // Preload BoardHeader regardless since it's on every view
  importWithRetryAndIgnoreFailures(
    () =>
      import(
        /* webpackChunkName: "board-header" */ 'app/src/components/BoardHeader/BoardHeader'
      ),
  );

  if (isActiveRoute(state, RouteId.BOARD)) {
    switch (state.params.view) {
      case 'board':
        importWithRetryAndIgnoreFailures(
          () =>
            import(
              /* webpackChunkName: "board-list-view" */ 'app/src/components/BoardListView/BoardListView'
            ),
        );
        break;
      case 'dashboard':
        importWithRetryAndIgnoreFailures(
          () =>
            import(
              /* webpackChunkName: "board-dashboard-view" */ 'app/src/components/BoardDashboardView'
            ),
        );
        break;
      case 'timeline':
        importWithRetryAndIgnoreFailures(
          () =>
            import(
              /* webpackChunkName: "timeline-view" */ 'app/src/components/TimelineViewWrapper/TimelineView'
            ),
        );
        break;
      case 'power-ups':
      case 'power-up':
        importWithRetryAndIgnoreFailures(
          () =>
            import(
              /* webpackChunkName: "board-power-ups-directory" */ 'app/src/components/BoardPowerUpsDirectory/BoardPowerUpsDirectory'
            ),
        );
        break;
      case 'map':
        importWithRetryAndIgnoreFailures(
          () =>
            import(
              /* webpackChunkName: "map-view" */ 'app/src/components/MapView'
            ),
        );
        break;
      case 'butler':
        importWithRetryAndIgnoreFailures(
          () =>
            import(
              /* webpackChunkName: "board-butler-view" */ './BoardButlerView'
            ),
        );
        break;
      case 'calendar':
        importWithRetryAndIgnoreFailures(
          () =>
            import(
              /* webpackChunkName: "legacy-calendar-view" */ './LegacyCalendarPowerUpView'
            ),
        );
        break;
      case 'calendar-view':
        importWithRetryAndIgnoreFailures(
          () =>
            import(
              /* webpackChunkName: "calendar-view" */ 'app/src/components/BoardCalendarView/CalendarView'
            ),
        );
        break;
      default:
        break;
    }
  } else if (isActiveRoute(state, RouteId.CARD)) {
    importWithRetryAndIgnoreFailures(
      () =>
        import(
          /* webpackChunkName: "board-list-view" */ 'app/src/components/BoardListView/BoardListView'
        ),
    );
  }
};
