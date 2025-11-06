import { useEffect, useRef } from 'react';

import type { Task } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { browserStr, osStr } from '@trello/browser';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { monitorStatus } from '@trello/monitor';
import { isActiveRoute, routerState, type RouterState } from '@trello/router';
import {
  getRouteIdFromPathname,
  isBoardRoute,
  RouteId,
  type RouteIdType,
} from '@trello/router/routes';
import { SharedState } from '@trello/shared-state';

import { getUpToDateModel } from 'app/scripts/db/getUpToDateModel';
import { ModelLoader } from 'app/scripts/db/model-loader';
import { getDeltaFromPreloadTraceId } from './getDeltaFromPreloadTraceId';
import { legacyBoardModelsSharedState } from './legacyBoardModelsSharedState';

interface ViewCardTaskStateStopped {
  traceId: null;
  error: null;
  status: 'stopped';
}
interface ViewCardTaskStateStarted {
  traceId: string;
  error: null;
  status: 'started';
}
interface ViewCardTaskStateCompleted {
  traceId: string;
  error: null;
  status: 'completed';
}
interface ViewCardTaskStateFailed {
  traceId: string;
  error: Error | string;
  status: 'failed';
}

export const viewCardTaskState = new SharedState<
  | ViewCardTaskStateCompleted
  | ViewCardTaskStateFailed
  | ViewCardTaskStateStarted
  | ViewCardTaskStateStopped
>({
  traceId: null,
  error: null,
  status: 'stopped',
});

let isFirstCardPaint = true;

const runViewCard = (
  state: RouterState<RouteIdType>,
  type: 'initial' | 'transition',
) => {
  let unsubscribeFromTaskState = () => {};
  let unsubscribeFromModels = () => {};
  const start = Date.now();
  const source = getScreenFromUrl();

  const traceId = ModelLoader.getPreloadTraceId();
  const preloadDelta = getDeltaFromPreloadTraceId(traceId);
  const cardShortLink = isActiveRoute(state, RouteId.CARD)
    ? state.params.shortLink
    : null;
  const isCardCached = !!getUpToDateModel('Card', cardShortLink);
  const stableIsFirstCardPaint = isFirstCardPaint;
  const taskName: Task =
    type === 'transition' ? 'view-card' : 'view-card/initial-load';

  isFirstCardPaint = false;
  let renderTime = 0;
  let loadTime = 0;
  let cardId: string | null = null;

  const sharedAttributes = () => ({
    browser: browserStr,
    os: osStr,
    isPageActive: monitorStatus.value === 'active',
    cardShortLink: isActiveRoute(state, RouteId.CARD)
      ? state.params.shortLink
      : null,
    cardId,
    isFirstCardPaint: stableIsFirstCardPaint,
    isInitialLoad: !!preloadDelta,
    renderTime,
    loadTime,
    timeFromPageStartToBoardStart: preloadDelta ? Math.abs(preloadDelta) : null,
    isCardCached,
  });

  const unsubscribeAndResetTaskState = () => {
    unsubscribeFromTaskState();
    unsubscribeFromModels();
    viewCardTaskState.reset();
  };

  if (!isActiveRoute(state, RouteId.CARD)) {
    if (viewCardTaskState.value.status === 'started') {
      Analytics.taskAborted({
        taskName,
        traceId: viewCardTaskState.value.traceId!,
        source,
        error: new Error('Card route not active'),
        attributes: sharedAttributes(),
      });
      unsubscribeAndResetTaskState();
      // Return noop because we don't want consumer to unsubscribe after we already did.
      return () => {};
    }
    return unsubscribeAndResetTaskState;
  }

  viewCardTaskState.setValue({
    traceId: Analytics.startTask({
      taskName,
      source,
      traceId,
      attributes: {
        taskDurationDelta: getDeltaFromPreloadTraceId(traceId),
        ...sharedAttributes(),
      },
    }),
    status: 'started',
  });

  const taskSucceeded = () => {
    renderTime = Date.now() - start - loadTime;
    Analytics.taskSucceeded({
      taskName,
      traceId: viewCardTaskState.value.traceId!,
      source,
      attributes: sharedAttributes(),
    });
    unsubscribeAndResetTaskState();
  };

  const taskFailed = (error: Error) => {
    renderTime = Date.now() - start - loadTime;
    Analytics.taskFailed({
      taskName,
      traceId: viewCardTaskState.value.traceId!,
      source,
      error,
      attributes: sharedAttributes(),
    });
    unsubscribeAndResetTaskState();
  };

  unsubscribeFromTaskState = viewCardTaskState.subscribe(
    ({ status, error }) => {
      if (status === 'completed') {
        taskSucceeded();
      } else if (status === 'failed') {
        taskFailed(error instanceof Error ? error : new Error(error));
      }
    },
  );

  unsubscribeFromModels = legacyBoardModelsSharedState.subscribe(
    ({ card, board }) => {
      if (card.model) {
        cardId = card.model.id;
        loadTime = Date.now() - start;
      }

      if (card.error) {
        taskFailed(new Error(card.error.name));
      } else if (board.error) {
        taskFailed(new Error(board.error.name));
      } else if (board?.model?.get('closed')) {
        taskSucceeded();
      }
    },
  );

  return () => {
    if (viewCardTaskState.value.status === 'started') {
      Analytics.taskAborted({
        taskName,
        traceId: viewCardTaskState.value.traceId!,
        source,
        attributes: sharedAttributes(),
      });
    }
    unsubscribeAndResetTaskState();
  };
};

export const useViewCardVitalStats = () => {
  const previousState = useRef('');
  const lastShortLink = useRef<string | null>(null);

  useEffect(() => {
    previousState.current = routerState.value.location.pathname;
    let previousRouteId = getRouteIdFromPathname(previousState.current);

    let cancelViewCard = () => {};
    let wasOnBoardRoute = isBoardRoute(previousRouteId);

    const unsubscribe = routerState.subscribe((state) => {
      cancelViewCard();

      if (
        isActiveRoute(state, RouteId.CARD) &&
        lastShortLink.current !== state.params.shortLink
      ) {
        cancelViewCard = runViewCard(
          state,
          wasOnBoardRoute ? 'transition' : 'initial',
        );

        lastShortLink.current = state.params.shortLink;
        wasOnBoardRoute = false;
      } else if (isActiveRoute(state, RouteId.BOARD)) {
        lastShortLink.current = state.params.shortLink;
      }

      previousState.current = routerState.value.location.pathname;
      previousRouteId = getRouteIdFromPathname(previousState.current);
      wasOnBoardRoute = isBoardRoute(previousRouteId);
    });

    if (
      isActiveRoute(routerState.value, RouteId.CARD) &&
      lastShortLink.current !== routerState.value.params.shortLink
    ) {
      cancelViewCard = runViewCard(
        routerState.value,
        wasOnBoardRoute ? 'transition' : 'initial',
      );
      lastShortLink.current = routerState.value.params.shortLink;
    }

    return () => {
      unsubscribe();
      cancelViewCard();
    };
  }, []);
};
