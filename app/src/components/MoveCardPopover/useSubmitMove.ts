import { useCallback } from 'react';

import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { client } from '@trello/graphql';
import { intl } from '@trello/i18n';
import { useBoardId, useCardId, useListId } from '@trello/id-context';
import { showFlag } from '@trello/nachos/experimental-flags';
import { useIsInboxBoard } from '@trello/personal-workspace';

import { useCardMove } from 'app/src/components/BoardListView/useCardMove';
import type { CurrentCardAttributesFragment } from './CurrentCardFragment.generated';
import { CurrentCardAttributesFragmentDoc } from './CurrentCardFragment.generated';
import { showCustomFieldErrorFlag } from './showCustomFieldErrorFlag';

export const useSubmitMove = () => {
  const cardId = useCardId();
  const boardId = useBoardId();
  const listId = useListId();
  const isInboxBoard = useIsInboxBoard();
  const { moveCard } = useCardMove();

  const submitMove = useCallback(
    async (
      selectedBoardId: string,
      selectedListId: string,
      selectedIndex: number,
      currentIndex: number,
      moveCardSource: SourceType,
    ) => {
      const movingWithinSameBoard = selectedBoardId === boardId;

      // don't submit request if current values are all selected
      if (
        movingWithinSameBoard &&
        selectedListId === listId &&
        selectedIndex === currentIndex
      ) {
        return;
      }

      const currentCard = client.readFragment<CurrentCardAttributesFragment>(
        {
          id: `Card:${cardId}`,
          fragment: CurrentCardAttributesFragmentDoc,
        },
        true,
      );

      if (!currentCard) {
        return;
      }

      try {
        await moveCard({
          cardId,
          listId: selectedListId,
          index: selectedIndex,
          boardId: selectedBoardId,
        });

        Analytics.sendTrackEvent({
          action: 'moved',
          actionSubject: 'card',
          source: moveCardSource,
          attributes: {
            sameBoard: movingWithinSameBoard,
            suggested: false,
            cardIsClosed: currentCard?.closed,
            cardIsTemplate: currentCard?.isTemplate,
            cardRole: currentCard?.cardRole,
            isModernizedMoveCardPopover: true,
            containerType: isInboxBoard ? 'inbox' : undefined,
          },
          containers: formatContainers({
            cardId,
            listId,
            boardId,
          }),
        });
      } catch (error) {
        const isCustomFieldError = showCustomFieldErrorFlag({
          error,
          targetBoardId: boardId,
          flagId: 'card-move-popover-move-submit',
        });

        if (!isCustomFieldError) {
          showFlag({
            appearance: 'error',
            id: 'card-move-popover-move-submit',
            isAutoDismiss: true,
            title: intl.formatMessage({
              id: 'templates.popover_move_card.could-not-move-card',
              defaultMessage: 'Moving card failed',
              description: 'Moving card failed error flag message',
            }),
          });
        }
      }
    },
    [cardId, boardId, listId, moveCard, isInboxBoard],
  );

  return { submitMove };
};
