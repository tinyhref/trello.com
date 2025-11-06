import { useCallback, useEffect } from 'react';

import { useRouteParams } from '@trello/router';
import type { RouteId } from '@trello/router/routes';
import { TrelloStorage } from '@trello/storage';

import { switchCurrentBoardView } from 'app/src/components/Board/switchCurrentBoardView';
import type { ZoomLevel } from 'app/src/components/ViewsGenerics';

interface CalendarDeepLinkingProps {
  currentZoomLevel: ZoomLevel;
  selectedDate: Date;
}

export const useCalendarDeepLinking = ({
  currentZoomLevel,
  selectedDate,
}: CalendarDeepLinkingProps) => {
  const { view } = useRouteParams<typeof RouteId.BOARD>();

  useEffect(() => {
    if (view !== 'calendar') {
      return;
    }

    if (currentZoomLevel === 'month') {
      switchCurrentBoardView({
        routeParams: {
          view,
          year: `${selectedDate.getFullYear()}`,
          month: `${selectedDate.getMonth() + 1}`,
        },
        navigateOptions: {
          replace: true,
        },
      });
    } else if (currentZoomLevel === 'week') {
      switchCurrentBoardView({
        routeParams: {
          view,
          year: `${selectedDate.getFullYear()}`,
          month: `${selectedDate.getMonth() + 1}`,
          day: `${selectedDate.getDate()}`,
        },
        navigateOptions: {
          replace: true,
        },
      });
    } else if (currentZoomLevel === 'day') {
      switchCurrentBoardView({
        routeParams: {
          view,
          year: `${selectedDate.getFullYear()}`,
          month: `${selectedDate.getMonth() + 1}`,
          day: `${selectedDate.getDate()}`,
        },
        navigateOptions: {
          replace: true,
        },
      });
    }
  }, [currentZoomLevel, selectedDate, view]);
};

export const useCalendarDefaultZoom = () => {
  const routeParams = useRouteParams<typeof RouteId.BOARD>();

  const calendarDefaultZoom = useCallback((): ZoomLevel | undefined => {
    if (routeParams.view !== 'calendar') {
      return undefined;
    }

    const storedZoomLevel = TrelloStorage.get('calendarZoomLevel');
    let defaultZoom: ZoomLevel = storedZoomLevel || 'month';

    if (routeParams.day && defaultZoom === 'month') {
      defaultZoom = 'week';
    } else if (
      defaultZoom !== 'month' &&
      typeof routeParams.day === 'undefined' &&
      routeParams.month
    ) {
      defaultZoom = 'month';
    }
    return defaultZoom;
  }, [routeParams]);
  return calendarDefaultZoom;
};
