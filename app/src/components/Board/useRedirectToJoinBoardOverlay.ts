import { useEffect, useMemo } from 'react';

import { isMemberLoggedIn } from '@trello/authentication';
import { inviteTokenForModel } from '@trello/invitation-tokens';
import { addSearchParamsToLocation, getLocation } from '@trello/router';
import { navigate } from '@trello/router/navigate';

import { useBoardInvitedMemberFragment } from './BoardInvitedMemberFragment.generated';

export const useRedirectToJoinBoardOverlay = (boardId?: string | null) => {
  const memberIdFromToken = useMemo(() => {
    if (boardId) {
      return inviteTokenForModel(boardId)?.split('-')?.[0];
    }
  }, [boardId]);

  const { data: invitedMember } = useBoardInvitedMemberFragment({
    from: { id: memberIdFromToken },
    optimistic: true,
  });

  const invitedMemberIsGhost = invitedMember?.memberType === 'ghost';

  useEffect(() => {
    const showJoinBoardModal = !isMemberLoggedIn() && invitedMemberIsGhost;

    if (showJoinBoardModal) {
      const location = addSearchParamsToLocation(getLocation(), {
        overlay: 'join',
      });
      navigate(`${location.pathname}${location.search}`, { trigger: false });
    }
  }, [invitedMemberIsGhost]);
};
