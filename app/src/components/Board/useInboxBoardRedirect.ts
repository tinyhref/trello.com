import { useLayoutEffect } from 'react';

import { useFeatureGate } from '@trello/feature-gate-client';
import { idCache } from '@trello/id-cache';
import { useIsInboxBoardWithId } from '@trello/personal-workspace';
import { mostRecentBoardSharedState } from '@trello/recent-boards';
import {
  addSearchParamsToLocation,
  getLocation,
  isActiveRoute,
  routerState,
} from '@trello/router';
import { navigate } from '@trello/router/navigate';
import { RouteId } from '@trello/router/routes';
import { useSharedStateSelector } from '@trello/shared-state';

interface UseInboxBoardRedirectProps {
  boardId: string | null;
  shortLinkOrId: string | null;
}

export const useInboxBoardRedirect = ({
  boardId,
  shortLinkOrId,
}: UseInboxBoardRedirectProps) => {
  const isInboxBoard = useIsInboxBoardWithId(boardId ?? '');
  const { value: isPersonalProductivityEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );
  const isCardRouteActive = isActiveRoute(routerState.value, RouteId.CARD);
  const isBoardRouteActive = isActiveRoute(routerState.value, RouteId.BOARD);

  const recentBoardShortLink = useSharedStateSelector(
    mostRecentBoardSharedState,
    (state) => state.shortLink,
  );

  // useLayoutEffect is used to ensure that the redirect is triggered immediately after the component mounts
  // this is to avoid a flash of screen and always access the consistent router state
  useLayoutEffect(() => {
    // This handles the case where a user accidentally navigates to the inbox board when Personal Productivity is disabled.
    // we redirect to the home page to avoid showing the inbox board
    if (!isPersonalProductivityEnabled && isInboxBoard) {
      navigate('/', { trigger: true, replace: true });
      return;
    }

    if (!isInboxBoard || !recentBoardShortLink) {
      return;
    }
    if (isCardRouteActive) {
      const cardId = idCache.getCardId(shortLinkOrId ?? '') ?? '';
      const location = addSearchParamsToLocation(getLocation(), {
        openCard: cardId,
      });

      navigate(`b/${recentBoardShortLink}${location.search}`, {
        trigger: false,
      });
    } else if (isBoardRouteActive) {
      navigate(`b/${recentBoardShortLink}`, {
        trigger: false,
      });
    }
  }, [
    isBoardRouteActive,
    isCardRouteActive,
    isInboxBoard,
    isPersonalProductivityEnabled,
    recentBoardShortLink,
    shortLinkOrId,
  ]);
};
