import { useEffect, useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { isDesktop } from '@trello/browser';
import type { StarredBoardsPayload } from '@trello/desktop';
import { desktopIpc } from '@trello/desktop';

import { useDesktopStarredBoardsListQuery } from './DesktopStarredBoardsListQuery.generated';
import { useDesktopStarredBoardsQuery } from './DesktopStarredBoardsQuery.generated';

const sendUpdateToDesktop = (boards: StarredBoardsPayload) => {
  desktopIpc?.send('starred-boards', boards);
};

export const useDesktopStarredBoards = () => {
  const memberId = useMemberId();
  const isStarredBoardsUpdatesSupported = useMemo(
    () => isDesktop() && desktopIpc?.isChannelSupported('starred-boards'),
    [],
  );

  const { data: starredBoardsData } = useDesktopStarredBoardsQuery({
    variables: {
      memberId,
    },
    skip: !isStarredBoardsUpdatesSupported,
    waitOn: ['MemberBoards'],
  });

  const memberBoardStars = starredBoardsData?.member?.boardStars;

  const starredBoardIds = useMemo(
    () => (memberBoardStars || []).map(({ idBoard }) => idBoard),
    [memberBoardStars],
  );

  const { data: starredBoards } = useDesktopStarredBoardsListQuery({
    variables: { boardIds: starredBoardIds },
    skip: !isStarredBoardsUpdatesSupported,
    waitOn: ['None'],
  });

  useEffect(() => {
    if (!starredBoards?.boards || !memberBoardStars) {
      return;
    }

    const boards: StarredBoardsPayload = (starredBoards?.boards || []).map(
      ({ id, name, url, prefs }) => ({
        id,
        name,
        url,
        prefs: {
          backgroundImage: prefs?.backgroundImage as string,
          backgroundColor: prefs?.backgroundColor as string,
        },
        pos: memberBoardStars.find(({ idBoard }) => idBoard === id)?.pos || 0,
      }),
    );

    sendUpdateToDesktop(boards);
  }, [memberBoardStars, starredBoards?.boards]);
};
