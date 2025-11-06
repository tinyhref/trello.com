import { isAtOrOverLimit } from '@trello/business-logic/limit';
import { useBoardId } from '@trello/id-context';

import { useListComposerBoardListLimitsFragment } from './ListComposerBoardListLimitsFragment.generated';

export const useListComposerLimits = () => {
  const boardId = useBoardId();

  const { data } = useListComposerBoardListLimitsFragment({
    from: { id: boardId },
  });

  const { openPerBoard, totalPerBoard } = data?.limits?.lists ?? {};

  const hasTooManyOpenLists = isAtOrOverLimit(openPerBoard);
  const hasTooManyTotalLists = isAtOrOverLimit(totalPerBoard);

  const isListComposerDisabled = hasTooManyOpenLists || hasTooManyTotalLists;

  return {
    hasTooManyOpenLists,
    hasTooManyTotalLists,
    isListComposerDisabled,
  };
};
