import { useEffect } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { browserStr, osStr } from '@trello/browser';
import { client } from '@trello/graphql';
import { isShortLink } from '@trello/id-cache';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { monitorStatus } from '@trello/monitor';
import { isActiveRoute, routerState, type RouterState } from '@trello/router';
import { RouteId, type RouteIdType } from '@trello/router/routes';

import { getUpToDateModel } from 'app/scripts/db/getUpToDateModel';
import { ModelLoader } from 'app/scripts/db/model-loader';
import { getDeltaFromPreloadTraceId } from './getDeltaFromPreloadTraceId';
import { legacyBoardModelsSharedState } from './legacyBoardModelsSharedState';
import {
  ViewBoardCardListDocument,
  type ViewBoardCardListQuery,
  type ViewBoardCardListQueryVariables,
} from './ViewBoardCardListQuery.generated';
import { viewBoardTaskState } from './viewBoardTaskState';

let isFirstBoardPaint = true;

const runViewBoard = (currentRouteState: RouterState<RouteIdType>) => {
  let unsubscribeFromTaskState = () => {};
  let unsubscribeFromQuery = () => {};
  let unsubscribeFromSharedState = () => {};
  let unsubscribeFromMonitorStatus = () => {};
  let boardId: string | null = null;
  const source = getScreenFromUrl();
  const stableIsFirstBoardPaint = isFirstBoardPaint;
  isFirstBoardPaint = false;

  const start = Date.now();
  const traceId = ModelLoader.getPreloadTraceId();
  const preloadDelta = getDeltaFromPreloadTraceId(traceId);
  const isBoardCached =
    isActiveRoute(currentRouteState, RouteId.BOARD) &&
    !!getUpToDateModel('Board', currentRouteState.params.shortLink);

  let loadTime = 0;
  let renderTime = 0;

  const boardShortLink = isActiveRoute(currentRouteState, RouteId.BOARD)
    ? currentRouteState.params.shortLink
    : null;

  const sharedAttributes = () => ({
    browser: browserStr,
    os: osStr,
    isPageActive: monitorStatus.value === 'active',
    view: isActiveRoute(currentRouteState, RouteId.BOARD)
      ? currentRouteState.params.view
      : null,
    boardShortLink:
      boardShortLink && isShortLink(boardShortLink) ? boardShortLink : null,
    boardId,
    isFirstBoardPaint: stableIsFirstBoardPaint,
    isInitialLoad: !!preloadDelta,
    renderTime,
    loadTime,
    timeFromPageStartToBoardStart: preloadDelta ? Math.abs(preloadDelta) : null,
    isBoardCached,
  });

  const unsubscribeAndResetTaskState = () => {
    unsubscribeFromSharedState();
    unsubscribeFromTaskState();
    unsubscribeFromQuery();
    unsubscribeFromMonitorStatus();
    viewBoardTaskState.reset();
  };

  /**
   * Mark the task as aborted and unmount subscribers, then
   * reset the state of the task.
   */
  const taskAborted = (error: Error) => {
    Analytics.taskAborted({
      taskName: 'view-board',
      traceId: viewBoardTaskState.value.traceId!,
      source,
      attributes: {
        ...sharedAttributes(),
      },
      error,
    });
    unsubscribeAndResetTaskState();
  };

  if (!isActiveRoute(currentRouteState, RouteId.BOARD)) {
    /**
     * This should be impossible, since we check whether we are on a board before running this function.
     * However, to be safe we do this here as well.
     */
    if (viewBoardTaskState.value.status === 'started') {
      taskAborted(new Error('Board route not active'));
      unsubscribeAndResetTaskState();
      // Return noop because we don't want consumer to unsubscribe after we already did.
      return () => {};
    }
    return unsubscribeAndResetTaskState;
  }

  /**
   * Start the task and set the traceId and status
   */
  viewBoardTaskState.setValue({
    traceId: Analytics.startTask({
      taskName: 'view-board',
      source,
      traceId,
      attributes: {
        ...sharedAttributes(),
        taskDurationDelta: preloadDelta,
      },
    }),
    status: 'started',
  });

  // eslint-disable-next-line @trello/no-cache-only-queries
  const observer = client.watchQuery<
    ViewBoardCardListQuery,
    ViewBoardCardListQueryVariables
  >({
    query: ViewBoardCardListDocument,
    variables: {
      id: currentRouteState.params.shortLink,
    },
    fetchPolicy: 'cache-only',
  });

  /**
   * Mark the task as succeeded and unmount subscribers, then
   * reset the state of the task.
   */
  const taskSucceeded = () => {
    renderTime = Date.now() - start - loadTime;
    Analytics.taskSucceeded({
      taskName: 'view-board',
      traceId: viewBoardTaskState.value.traceId!,
      source,
      attributes: sharedAttributes(),
    });
    unsubscribeAndResetTaskState();
  };

  /**
   * Mark the task as aborted and unmount subscribers, then
   * reset the state of the task.
   */
  const taskFailed = (error: Error) => {
    renderTime = Date.now() - start - loadTime;

    Analytics.taskFailed({
      taskName: 'view-board',
      traceId: viewBoardTaskState.value.traceId!,
      source,
      error,
      attributes: sharedAttributes(),
    });
    unsubscribeAndResetTaskState();
  };

  unsubscribeFromMonitorStatus = monitorStatus.subscribe((state) => {
    /**
     * Often times users will load trello then click to another browser tab.
     * As a result, we get long duration tasks that sometimes never succeed.
     * This state will change when the page becomes idle, and tracking only active
     * users makes the analytics more accurate for what we want.
     */
    if (state === 'idle') {
      taskAborted(new Error('User tab went idle'));
    }
  });

  unsubscribeFromTaskState = viewBoardTaskState.subscribe(
    ({ status, error }) => {
      if (status === 'completed') {
        taskSucceeded();
      } else if (status === 'failed') {
        taskFailed(error instanceof Error ? error : new Error(error));
      }
    },
  );

  unsubscribeFromSharedState = legacyBoardModelsSharedState.subscribe(
    (state) => {
      if (!state.board.loading) {
        loadTime = preloadDelta
          ? Date.now() - start + Math.abs(preloadDelta)
          : Date.now() - start;
      }

      if (state.board.error) {
        let error: Error = new Error('Unknown error');

        if (state.board.error instanceof Error) {
          error = state.board.error;
          taskFailed(error);
        } else if (
          state.board.error?.name ||
          state.board.error?.name === 'BoardNotFound'
        ) {
          error = new Error(state.board.error.name);
          taskAborted(error);
        }
      } else if (
        !state.board.loading &&
        currentRouteState.params.view !== 'board'
      ) {
        taskSucceeded();
      }
    },
  );

  const subscriber = observer.subscribe((result) => {
    if (result.data.board?.id) {
      boardId = result.data.board.id;
    }

    if (result.data.board?.cards) {
      // If there are no cards, then CardFront will never mark the task as succeeded,
      // so we do it here instead.
      if (result.data.board.cards.length === 0) {
        taskSucceeded();
      }
    }

    // If the board is closed, we won't show cards so mark it complete
    if (result.data.board?.closed) {
      taskSucceeded();
    }
  });

  unsubscribeFromQuery = subscriber.unsubscribe.bind(subscriber);

  return () => {
    /**
     * In this case, we started a task, then changed boards. As a result, we now
     * need to abort the task to be safe.
     */
    if (viewBoardTaskState.value.status === 'started') {
      taskAborted(new Error('Navigation to new board or route'));
    }

    unsubscribeAndResetTaskState();
  };
};

/**
 * Utility hook that will initialize a new view-board task when boardId
 * changes and the active view is "board". It will start the task and wait for
 * the CardFront component to mark the state as "completed", which will fire the
 * taskSucceeded event. The reason it is implemented this way is because we cannot
 * determine performance in React because of it's asynchronous rendering cycle.
 */
export const useViewBoardVitalStats = () => {
  useEffect(() => {
    let cancelViewBoard = () => {};
    let lastRouteId: RouteIdType | null = null;
    let lastBoardShortLink: string | null = null;
    let lastBoardView: string | null = null;

    const unsubscribe = routerState.subscribe((state) => {
      cancelViewBoard();

      if (
        // Only run if were on a board route
        (isActiveRoute(state, RouteId.BOARD) ||
          isActiveRoute(state, RouteId.INVITE_ACCEPT_BOARD)) &&
        // If the last route was card, we already rendered the board
        lastRouteId !== RouteId.CARD &&
        // If the last route was board, we just changed search params, or we changed the view
        // for the current board
        (lastBoardShortLink !== state.params?.shortLink ||
          lastBoardView !== state.params.view)
      ) {
        cancelViewBoard = runViewBoard(state);
      }

      lastRouteId = state.id;

      if (
        isActiveRoute(state, RouteId.BOARD) ||
        isActiveRoute(state, RouteId.INVITE_ACCEPT_BOARD)
      ) {
        lastBoardShortLink = state.params?.shortLink || null;
        lastBoardView = state.params?.view || null;
      }
    });

    cancelViewBoard = runViewBoard(routerState.value);
    lastRouteId = routerState.value.id;
    if (
      isActiveRoute(routerState.value, RouteId.BOARD) ||
      isActiveRoute(routerState.value, RouteId.INVITE_ACCEPT_BOARD)
    ) {
      lastBoardShortLink = routerState.value.params?.shortLink || null;
      lastBoardView = routerState.value.params?.view || null;
    }

    return () => {
      unsubscribe();
      cancelViewBoard();
    };
  }, []);
};
