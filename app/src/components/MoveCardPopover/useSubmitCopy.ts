import { useCallback } from 'react';

import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { client } from '@trello/graphql';
import { intl } from '@trello/i18n';
import { useBoardId, useCardId, useListId } from '@trello/id-context';
import { showFlag } from '@trello/nachos/experimental-flags';
import { calculateItemPosition, SPACING } from '@trello/position';

import { useCopyCardMutation } from 'app/src/components/BoardListView/CopyCardMutation.generated';
import { readListVisibleCardsFromCache } from 'app/src/components/List/readListVisibleCardsFromCache';
import type { CurrentCardAttributesFragment } from './CurrentCardFragment.generated';
import { CurrentCardAttributesFragmentDoc } from './CurrentCardFragment.generated';
import type { MoveCardCurrentBoardFragment } from './MoveCardCurrentBoardFragment.generated';
import { MoveCardCurrentBoardFragmentDoc } from './MoveCardCurrentBoardFragment.generated';
import { showCustomFieldErrorFlag } from './showCustomFieldErrorFlag';

type KeepFromSourceType =
  | 'attachments'
  | 'checklists'
  | 'comments'
  | 'customFields'
  | 'due'
  | 'dueReminder'
  | 'labels'
  | 'members'
  | 'start'
  | 'stickers';

export interface OptionalKeepFromSource {
  checklists: boolean;
  labels: boolean;
  members: boolean;
  attachments: boolean;
  comments: boolean;
  customFields: boolean;
  stickers: boolean;
}

export const useSubmitCopy = () => {
  const cardId = useCardId();
  const listId = useListId();
  const boardId = useBoardId();

  const [copyCardMutation] = useCopyCardMutation();

  const calculatePos = useCallback(
    (
      currentCard: CurrentCardAttributesFragment,
      selectedBoardId: string,
      selectedListId: string,
      selectedIndex: number,
    ): number => {
      const cards = readListVisibleCardsFromCache({
        boardId: selectedBoardId,
        listId: selectedListId,
      });

      const isCopyingWithinSameList = selectedListId === listId;
      if (!isCopyingWithinSameList) {
        return calculateItemPosition(selectedIndex, cards, currentCard);
      }

      if (!cards.length) {
        return 0;
      }

      // copy to top of list
      if (selectedIndex === 0) {
        return cards[0].pos / 2;
      }

      // copy to middle of list
      if (cards[selectedIndex] && cards[selectedIndex - 1]) {
        return (cards[selectedIndex].pos + cards[selectedIndex - 1].pos) / 2;
      }

      // copy to end of list
      return cards[cards.length - 1].pos + SPACING;
    },
    [listId],
  );

  /**
   * The copyCardMutation keepFromSource variable accepts an array of strings
   * which represent card attributes that will be maintained from the original
   * card when the new card is created.
   *
   * The optionalKeepFromSource object corresponds to the "Keep" checklist on
   * CopyCardPopover
   *
   * This function returns an array of strings that is passed to copyCardMutation
   * with a combination of mandatory fields to keep, as well as any fields that
   * are checked on the "Keep" checklist.
   */
  const getKeepFromSourceCardAttributes = useCallback(
    (optionalKeepFromSource?: OptionalKeepFromSource) => {
      // mandatory fields to keep
      const keepFromSource: KeepFromSourceType[] = [
        'start',
        'due',
        'dueReminder',
      ];

      if (!optionalKeepFromSource) {
        return keepFromSource;
      }

      // optional fields to keep
      const {
        checklists,
        labels,
        members,
        attachments,
        comments,
        customFields,
        stickers,
      } = optionalKeepFromSource;

      if (checklists) {
        keepFromSource.push('checklists');
      }
      if (labels) {
        keepFromSource.push('labels');
      }
      if (members) {
        keepFromSource.push('members');
      }
      if (attachments) {
        keepFromSource.push('attachments');
      }
      if (comments) {
        keepFromSource.push('comments');
      }
      if (customFields) {
        keepFromSource.push('customFields');
      }
      if (stickers) {
        keepFromSource.push('stickers');
      }

      return keepFromSource;
    },
    [],
  );

  const submitCopy = useCallback(
    async (
      selectedBoardId: string,
      selectedListId: string,
      selectedIndex: number,
      title: string,
      source: SourceType,
      optionalKeepFromSource?: OptionalKeepFromSource,
    ) => {
      const currentCard = client.readFragment<CurrentCardAttributesFragment>(
        {
          id: `Card:${cardId}`,
          fragment: CurrentCardAttributesFragmentDoc,
        },
        true,
      );

      const currentBoard = client.readFragment<MoveCardCurrentBoardFragment>(
        {
          id: `Board:${boardId}`,
          fragment: MoveCardCurrentBoardFragmentDoc,
        },
        true,
      );

      if (!currentCard || !currentBoard) {
        return;
      }

      const pos = calculatePos(
        currentCard,
        selectedBoardId,
        selectedListId,
        selectedIndex,
      );

      const keepFromSource = getKeepFromSourceCardAttributes(
        optionalKeepFromSource,
      );

      const taskName = 'create-card/copy';
      const traceId = Analytics.startTask({
        taskName,
        source,
      });
      const attributes = {
        cardIsTemplate: currentCard.isTemplate,
        cardIsClosed: currentCard.closed,
        isBoardTemplate: !!currentBoard.prefs?.isTemplate,
        cardRole: currentCard.cardRole,
        isModernizedCopyCardPopover: true,
      };

      try {
        await copyCardMutation({
          variables: {
            idCardSource: cardId,
            idList: selectedListId,
            pos,
            keepFromSource,
            name: title,
            traceId,
          },
        });

        Analytics.sendTrackEvent({
          action: 'copied',
          actionSubject: 'card',
          source,
          containers: formatContainers({
            cardId,
            listId,
            boardId,
          }),
          attributes: {
            ...attributes,
            taskId: traceId,
          },
        });

        Analytics.taskSucceeded({
          taskName,
          source,
          traceId,
          attributes,
        });
      } catch (error) {
        const isCustomFieldError = showCustomFieldErrorFlag({
          error,
          targetBoardId: selectedBoardId,
          flagId: 'card-copy-popover-copy-submit',
        });

        if (!isCustomFieldError) {
          // If a custom fields limits error flag isn't shown, then show a generic error flag
          showFlag({
            appearance: 'error',
            id: 'card-copy-popover-copy-submit',
            isAutoDismiss: true,
            title: intl.formatMessage({
              id: 'templates.card_copy.copy-card-error',
              defaultMessage: 'Unable to copy card',
              description: 'Copy card failed error flag message',
            }),
          });
        }
        Analytics.sendOperationalEvent({
          action: 'failed',
          actionSubject: 'cardCopy',
          source,
          containers: formatContainers({
            cardId,
            listId,
            boardId,
          }),
          attributes: {
            ...attributes,
            taskId: traceId,
          },
        });

        Analytics.taskFailed({
          taskName,
          traceId,
          source,
          error,
          attributes,
        });
      }
    },
    [
      copyCardMutation,
      getKeepFromSourceCardAttributes,
      calculatePos,
      cardId,
      boardId,
      listId,
    ],
  );

  return { submitCopy };
};
