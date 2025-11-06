import { useMemberId } from '@trello/authentication';
import { isAdminOfBoard } from '@trello/business-logic/board';

import { useBoardIdFromBoardOrCardRoute } from 'app/src/components/Board/useBoardIdFromBoardOrCardRoute';
import { useClosedBoardBannerFragment } from './ClosedBoardBannerFragment.generated';
import { useClosedBoardBannerMemberFragment } from './ClosedBoardBannerMemberFragment.generated';

export const useClosedBoardBanner = () => {
  const boardId = useBoardIdFromBoardOrCardRoute();
  const { data: boardData } = useClosedBoardBannerFragment({
    from: { id: boardId },
  });
  const memberId = useMemberId();
  const { data: memberData } = useClosedBoardBannerMemberFragment({
    from: { id: memberId },
    returnPartialData: true,
  });

  let isAdmin = false;
  if (memberData && boardData) {
    isAdmin = isAdminOfBoard(memberData, boardData);
  }

  if (boardData?.closed && isAdmin) {
    return { wouldRender: true };
  }

  return { wouldRender: false };
};
