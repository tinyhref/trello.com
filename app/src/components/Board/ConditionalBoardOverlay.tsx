import type { FunctionComponent } from 'react';
import { useCallback, useEffect } from 'react';

import { useBoardId } from '@trello/id-context';
import { Dialog, useDialog } from '@trello/nachos/dialog';
import {
  getLocation,
  removeSearchParamsFromLocation,
  useSearchParams,
} from '@trello/router';
import { navigate } from '@trello/router/navigate';

import { LazyBoardInviteModal } from 'app/src/components/BoardInviteModal';
import { LazyJoinBoardModal } from 'app/src/components/JoinBoardModal';
import { LazyMemberBoardActivity } from 'app/src/components/MemberBoardActivity';
import { LazyRequestAccessConfirmationModal } from 'app/src/components/RequestAccessConfirmationModal';

export const ConditionalBoardOverlay: FunctionComponent = () => {
  const boardId = useBoardId();
  const { dialogProps, show } = useDialog();
  const searchParams = useSearchParams();
  const overlay = searchParams.get('overlay');

  const closeOverlay = useCallback(
    (location: ReturnType<typeof getLocation> = getLocation()) => {
      location = removeSearchParamsFromLocation(location, ['overlay']);
      navigate(`${location.pathname}${location.search}`, { trigger: false });
    },
    [],
  );

  const closeRequestAccessOrBoardInviteOverlay = useCallback(() => {
    const location = removeSearchParamsFromLocation(getLocation(), [
      'inviteMemberId',
      'signature',
    ]);
    closeOverlay(location);
  }, [closeOverlay]);

  const closeMemberActivityOverlay = useCallback(() => {
    const location = removeSearchParamsFromLocation(getLocation(), ['u']);
    closeOverlay(location);
  }, [closeOverlay]);

  useEffect(() => {
    if (overlay) {
      show();
    }
  }, [overlay, show]);

  useEffect(() => {
    if (overlay === 'request-access') {
      if (
        !searchParams.get('inviteMemberId') ||
        !searchParams.get('signature')
      ) {
        closeRequestAccessOrBoardInviteOverlay();
      }
    }
  }, [closeRequestAccessOrBoardInviteOverlay, overlay, searchParams]);

  switch (overlay) {
    case 'member-activity':
      return (
        <Dialog {...dialogProps} hide={closeMemberActivityOverlay}>
          <LazyMemberBoardActivity onClickClose={closeMemberActivityOverlay} />
        </Dialog>
      );
    case 'share':
      return (
        <Dialog {...dialogProps} hide={closeRequestAccessOrBoardInviteOverlay}>
          <LazyBoardInviteModal
            idBoard={boardId}
            onClose={closeRequestAccessOrBoardInviteOverlay}
          />
        </Dialog>
      );
    case 'join':
      return (
        <Dialog
          {...dialogProps}
          closeOnOutsideClick={false}
          closeOnEscape={false}
          alignment="center"
        >
          <LazyJoinBoardModal idBoard={boardId} />
        </Dialog>
      );
    case 'request-access':
      return (
        <Dialog {...dialogProps} hide={closeRequestAccessOrBoardInviteOverlay}>
          <LazyRequestAccessConfirmationModal
            boardId={boardId}
            idMember={searchParams.get('inviteMemberId') as string}
            signature={searchParams.get('signature') as string}
            onClose={closeRequestAccessOrBoardInviteOverlay}
          />
        </Dialog>
      );
    default:
      return null;
  }
};
