import { useMemberId } from '@trello/authentication';
import { getRecentBoards } from '@trello/recent-boards';

import { maxSelectableBoards } from 'app/src/components/BoardViewContext';
import type { BoardIdAndShortLink } from './filters';
import { usePrePopulatedBoardsShortlinkQuery } from './PrePopulatedBoardsShortlinkQuery.generated';
import { usePrePopulatedBoardsStarsQuery } from './PrePopulatedBoardsStarsQuery.generated';

/**
 * The spiritual successor to `useMostRelevantBoards`, this hook gets a set of
 * boards for "subtractive" workspace views.
 */
export const usePrePopulatedBoardsFilter = (
  workspaceId: string,
  skip?: boolean,
): { loading: boolean; boards?: BoardIdAndShortLink[] } => {
  const memberId = useMemberId();
  const { loading: starsLoading, data } = usePrePopulatedBoardsStarsQuery({
    variables: { memberId },
    skip,
    waitOn: ['MemberHeader', 'MemberBoards'],
  });

  const boardStarIds =
    data?.member?.boardStars
      // This creates a copy of the array which we need to do before sorting.
      .slice()
      .sort((a, b) => a.pos - b.pos)
      .map((board) => board.idBoard) ?? [];

  const recentBoardIds = getRecentBoards()
    .slice()
    .sort((a, b) => {
      return (
        new Date(a.dateLastView).getTime() - new Date(b.dateLastView).getTime()
      );
    })
    .map((board) => board.id);

  // Dedupes
  const aggregateIds = [...new Set([...boardStarIds, ...recentBoardIds])];

  const { loading: shortLinksLoading, data: shortLinkData } =
    usePrePopulatedBoardsShortlinkQuery({
      variables: {
        workspaceId,
        boardIds: aggregateIds,
      },
      skip,
      waitOn: ['MemberHeader', 'MemberBoards'],
    });

  if (skip) return { loading: false };

  if (!shortLinkData?.organization?.boards || starsLoading || shortLinksLoading)
    return { loading: true };

  const orgBoardIdsToShortLinks: {
    [id: string]: { id: string; shortLink: string };
  } = {};

  shortLinkData.organization.boards.forEach((board) => {
    orgBoardIdsToShortLinks[board.id] = board;
  });

  const selectedShortLinkData = aggregateIds
    .map((id) => orgBoardIdsToShortLinks[id])
    .filter(Boolean)
    .slice(0, maxSelectableBoards());

  return {
    loading: false,
    boards: selectedShortLinkData,
  };
};
