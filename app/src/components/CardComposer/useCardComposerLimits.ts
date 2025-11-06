import { isAtOrOverLimit } from '@trello/business-logic/limit';
import { useBoardId, useListId } from '@trello/id-context';

import { useCardComposerLimitsBoardFragment } from './CardComposerLimitsBoardFragment.generated';
import { useCardComposerLimitsListFragment } from './CardComposerLimitsListFragment.generated';

/**
 * Compares the number of cards on the board and list, and returns a boolean
 * indicating whether a new card can be created.
 */
export const useCardComposerLimits = () => {
  const boardId = useBoardId();
  const listId = useListId();

  const { data: board } = useCardComposerLimitsBoardFragment({
    from: { id: boardId },
    optimistic: true,
  });

  const { data: list } = useCardComposerLimitsListFragment({
    from: { id: listId },
    optimistic: true,
  });

  const boardLimits = board?.limits?.cards;
  const openPerBoard = boardLimits?.openPerBoard;
  const totalPerBoard = boardLimits?.totalPerBoard;

  const listLimits = list?.limits?.cards;
  const openPerList = listLimits?.openPerList;
  const totalPerList = listLimits?.totalPerList;

  const isAtOrOverBoardLimits =
    (Boolean(openPerBoard) && isAtOrOverLimit(openPerBoard)) ||
    (Boolean(totalPerBoard) && isAtOrOverLimit(totalPerBoard));
  const isAtOrOverListLimits =
    (Boolean(openPerList) && isAtOrOverLimit(openPerList)) ||
    (Boolean(totalPerList) && isAtOrOverLimit(totalPerList));

  return isAtOrOverBoardLimits || isAtOrOverListLimits;
};
