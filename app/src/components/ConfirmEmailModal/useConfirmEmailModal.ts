import { useMemberId } from '@trello/authentication';
import { useBoardMembers } from '@trello/business-logic-react/board';
import { hasValidInvitationLinkForModel } from '@trello/invitation-links';
import { useRouteParams } from '@trello/router';
import { type RouteId } from '@trello/router/routes';

import { useConfirmEmailModalMemberFragment } from './ConfirmEmailModalMemberFragment.generated';

interface HookProps {
  boardId: string;
}

export const useConfirmEmailModal = ({ boardId }: HookProps) => {
  const { getMemberPermissionLevel } = useBoardMembers(boardId);
  const memberId = useMemberId();
  const { shortLink } = useRouteParams<
    typeof RouteId.BOARD | typeof RouteId.BOARD_REFERRAL
  >();
  const { data: member } = useConfirmEmailModalMemberFragment({
    from: { id: memberId },
  });

  const hasValidInviteLink = hasValidInvitationLinkForModel(
    'board',
    {
      id: boardId,
      shortLink,
    },
    getMemberPermissionLevel(memberId),
  );

  const wouldRender = !member?.confirmed && hasValidInviteLink;
  return { wouldRender };
};
