import { useCallback } from 'react';

import { isAtOrOverLimit } from '@trello/business-logic/limit';
import { client } from '@trello/graphql';
import { intl } from '@trello/i18n';
import { useBoardId } from '@trello/id-context';

import type { CardMoveLimitsBoardFragment } from './CardMoveLimitsBoardFragment.generated';
import { CardMoveLimitsBoardFragmentDoc } from './CardMoveLimitsBoardFragment.generated';
import type { CardMoveLimitsListFragment } from './CardMoveLimitsListFragment.generated';
import { CardMoveLimitsListFragmentDoc } from './CardMoveLimitsListFragment.generated';
import type { CurrentCardAttributesFragment } from './CurrentCardFragment.generated';
import { CurrentCardAttributesFragmentDoc } from './CurrentCardFragment.generated';
import type { OptionalKeepFromSource } from './useSubmitCopy';

interface OptionalModelIds {
  cardId?: string;
  listId?: string;
}

/**
 * This hook checks for board and list limits for moving and copying a card.
 * It returns the relevant limit string if the card cannot be moved/copied
 * to the target board/list due to limits.
 * It returns false if no limits are exceeded.
 */
export const useCardLimits = (optionalModelIds?: OptionalModelIds) => {
  const currentBoardId = useBoardId();
  const currentListId = optionalModelIds?.listId;
  const currentCardId = optionalModelIds?.cardId;

  const isOverLimits = useCallback(
    (
      targetBoardId: string,
      targetListId: string,
      isMove?: boolean,
      keepOptions?: OptionalKeepFromSource,
    ) => {
      const boardLimitsData = client.readFragment<CardMoveLimitsBoardFragment>(
        {
          id: `Board:${targetBoardId}`,
          fragment: CardMoveLimitsBoardFragmentDoc,
        },
        true,
      );

      const listLimitsData = client.readFragment<CardMoveLimitsListFragment>(
        {
          id: `List:${targetListId}`,
          fragment: CardMoveLimitsListFragmentDoc,
        },
        true,
      );

      const currentCardData =
        client.readFragment<CurrentCardAttributesFragment>(
          {
            id: `Card:${currentCardId}`,
            fragment: CurrentCardAttributesFragmentDoc,
          },
          true,
        );

      const isWithinBoard = currentBoardId === targetBoardId;
      const isMoveWithinBoard = isMove && isWithinBoard;
      const isMoveWithinList = isMove && currentListId === targetListId;

      const boardName = boardLimitsData?.name ?? '';
      const listName = listLimitsData?.name ?? '';

      // card attributes
      const hasLabels = !!currentCardData?.idLabels.length;
      const hasAttachments = !!currentCardData?.attachments.length;
      const hasChecklists = !!currentCardData?.checklists?.length;

      // board limits
      const boardLimits = boardLimitsData?.limits;
      const openCardsPerBoard = boardLimits?.cards?.openPerBoard;
      const totalCardsPerBoard = boardLimits?.cards?.totalPerBoard;
      const labelsPerBoard = boardLimits?.labels.perBoard;
      const attachmentsPerBoard = boardLimits?.attachments?.perBoard;
      const checklistsPerBoard = boardLimits?.checklists?.perBoard;

      // list limits
      const listLimits = listLimitsData?.limits?.cards;
      const openCardsPerList = listLimits?.openPerList;
      const totalCardsPerList = listLimits?.totalPerList;

      const keepLabels = isMove || keepOptions?.labels;
      const keepAttachments = isMove || keepOptions?.attachments;
      const keepChecklists = isMove || keepOptions?.checklists;
      // board limits checks
      // if card is being moved within the same board then don't need to check for board limits
      if (!isMoveWithinBoard) {
        if (isAtOrOverLimit(openCardsPerBoard)) {
          return intl.formatMessage(
            {
              id: 'templates.card_limits_error.too-many-open-cards-per-board',
              defaultMessage:
                'You have too many open cards on “{boardName}”. Archive some to add more.',
              description: 'Board limit too many open cards',
            },
            { boardName },
          );
        } else if (isAtOrOverLimit(totalCardsPerBoard)) {
          return intl.formatMessage(
            {
              id: 'templates.card_limits_error.too-many-total-cards-per-board',
              defaultMessage:
                'You have too many cards on “{boardName}”. Delete some archived cards to add more.',
              description: 'Board limit too many total cards',
            },
            { boardName },
          );
        } else if (hasLabels && keepLabels && isAtOrOverLimit(labelsPerBoard)) {
          const disableAt = boardLimits?.labels.perBoard.disableAt;
          return intl.formatMessage(
            {
              id: 'templates.labels_popover.max-labels-limit-message',
              defaultMessage:
                'This board has the maximum number of labels ({disableAt}). To add new labels, you must first delete some existing labels.',
              description: 'Board limit too many labels',
            },
            { disableAt },
          );
        } else if (
          hasAttachments &&
          keepAttachments &&
          isAtOrOverLimit(attachmentsPerBoard)
        ) {
          return intl.formatMessage(
            {
              id: 'templates.limits_error.too-many-attachments-per-board',
              defaultMessage:
                'You have too many attachments on “{boardName}”. Delete some to add more.',
              description: 'Board limit too many attachments',
            },
            { boardName },
          );
        } else if (
          hasChecklists &&
          keepChecklists &&
          isAtOrOverLimit(checklistsPerBoard)
        ) {
          return intl.formatMessage(
            {
              id: 'templates.limits_error.too-many-checklists-per-board',
              defaultMessage:
                'You have too many checklists on “{boardName}”. Delete some to add more.',
              description: 'Board limit too many checklists',
            },
            { boardName },
          );
        }
      }

      // list limits checks
      // if card is being moved within the same list then don't need to check for list limits
      if (!isMoveWithinList) {
        if (isAtOrOverLimit(openCardsPerList)) {
          return intl.formatMessage(
            {
              id: 'templates.card_limits_error.too-many-open-cards-per-list',
              defaultMessage:
                'You have too many open cards on “{listName}”. Archive some to add more.',
              description: 'List limit too many open cards',
            },
            { listName },
          );
        } else if (isAtOrOverLimit(totalCardsPerList)) {
          return intl.formatMessage(
            {
              id: 'templates.card_limits_error.too-many-total-cards-per-list',
              defaultMessage:
                'You have too many cards on “{listName}”. Delete some archived cards to add more.',
              description: 'List limit too many total cards',
            },
            { listName },
          );
        }
      }

      return false;
    },
    [currentBoardId, currentCardId, currentListId],
  );
  return { isOverLimits };
};
