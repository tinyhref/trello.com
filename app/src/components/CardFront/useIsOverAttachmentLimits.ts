import { useCallback } from 'react';

import { client } from '@trello/graphql';
import { useBoardId } from '@trello/id-context';

import {
  type BoardAttachmentLimitsFragment,
  BoardAttachmentLimitsFragmentDoc,
} from './BoardAttachmentLimitsFragment.generated';
import {
  type CardAttachmentLimitsFragment,
  CardAttachmentLimitsFragmentDoc,
} from './CardAttachmentLimitsFragment.generated';

const OVER_LIMIT_VALUES = ['maxExceeded', 'disabled'];

export const useIsOverAttachmentLimits = () => {
  const boardId = useBoardId();

  const isOverAttachmentLimits = useCallback(
    async (cardId: string): Promise<boolean> => {
      if (!boardId || !cardId) {
        return true;
      }

      const boardData = client.readFragment<BoardAttachmentLimitsFragment>({
        fragment: BoardAttachmentLimitsFragmentDoc,
        id: `Board:${boardId}`,
      });

      if (
        OVER_LIMIT_VALUES.includes(
          boardData?.limits?.attachments?.perBoard?.status || '',
        )
      ) {
        return true;
      }

      const cardData = client.readFragment<CardAttachmentLimitsFragment>({
        fragment: CardAttachmentLimitsFragmentDoc,
        id: `Card:${cardId}`,
      });

      if (
        OVER_LIMIT_VALUES.includes(
          cardData?.limits?.attachments?.perCard?.status || '',
        )
      ) {
        return true;
      }

      return false;
    },
    [boardId],
  );

  return { isOverAttachmentLimits };
};
