import { useMemo } from 'react';

import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';

import { useBoardIdFromBoardOrCardRoute } from 'app/src/components/Board/useBoardIdFromBoardOrCardRoute';
import { useLoggedInPublicBoardBannerFragment } from './LoggedInPublicBoardBannerFragment.generated';

export const LOGGED_IN_PUBLIC_BOARD_BANNER_MESSAGE_KEY_PREFIX = `ad-logged-in-public-board-`;

export function useLoggedInPublicBoardBanner() {
  const boardId = useBoardIdFromBoardOrCardRoute();

  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();
  const { data: board } = useLoggedInPublicBoardBannerFragment({
    from: { id: boardId },
  });

  const isDismissed = useMemo(() => {
    return isOneTimeMessageDismissed(
      `${LOGGED_IN_PUBLIC_BOARD_BANNER_MESSAGE_KEY_PREFIX}${boardId}`,
    );
  }, [isOneTimeMessageDismissed, boardId]);

  const wouldRender =
    boardId &&
    isDismissed === false &&
    board?.prefs?.permissionLevel === 'public' &&
    board?.closed === false &&
    board?.prefs?.isTemplate === false;

  return {
    wouldRender,
  };
}
