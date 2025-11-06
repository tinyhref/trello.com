import { useMemberId } from '@trello/authentication';
import { useBoardMembers } from '@trello/business-logic-react/board';
import { hasValidBoardInvitationLink } from '@trello/invitation-links';
import { useBoardShortLink, useIsActiveRoute } from '@trello/router';
import { RouteId } from '@trello/router/routes';

import { useBoardIdFromBoardOrCardRoute } from 'app/src/components/Board/useBoardIdFromBoardOrCardRoute';
import { useConfirmEmailBannerFragment } from './ConfirmEmailBannerFragment.generated';

export const useConfirmEmailBanner = ({ skip = false }) => {
  const boardId = useBoardIdFromBoardOrCardRoute() || '';
  const boardShortLink = useBoardShortLink() || '';
  const memberId = useMemberId();
  const { getMemberPermissionLevel } = useBoardMembers(boardId);
  const isWelcomeToTrelloOnboarding = useIsActiveRoute(
    RouteId.WELCOME_TO_TRELLO,
  );
  const isBoardRoute = useIsActiveRoute(RouteId.BOARD);

  const { data: member } = useConfirmEmailBannerFragment({
    from: { id: memberId },
  });

  if (skip || !member || isWelcomeToTrelloOnboarding) {
    return {
      wouldRender: false,
    };
  }

  const hasValidInviteLink =
    isBoardRoute &&
    hasValidBoardInvitationLink(
      { id: boardId, shortLink: boardShortLink },
      getMemberPermissionLevel(memberId),
    );

  const wouldRender = !member.confirmed && !hasValidInviteLink;

  return {
    wouldRender,
  };
};
