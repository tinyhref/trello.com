import { useCallback } from 'react';

import { announceToLiveRegion } from '@trello/a11y';
import { ActionHistory } from '@trello/action-history';
import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { client, optimisticIdManager } from '@trello/graphql';
import { intl } from '@trello/i18n';
import { useBoardId, useCardId } from '@trello/id-context';
import { getScreenFromUrl } from '@trello/marketing-screens';
import type { Board } from '@trello/model-types';
import { showFlag } from '@trello/nachos/experimental-flags';

import { undoAction } from 'app/scripts/lib/last-action';
import { useIsInboxBoard } from 'app/src/components/Inbox';
import { useQuickCardEditorCardFrontFragment } from 'app/src/components/QuickCardEditor/QuickCardEditorCardFrontFragment.generated';
import { useArchiveCardMutation } from './ArchiveCardMutation.generated';

/** Filter out the closed card from the board.cards array */
function removeArchivedCardFromBoardInCache(cardId: string, boardId: string) {
  client.cache.modify<Board>({
    id: client.cache.identify({
      id: boardId,
      __typename: 'Board',
    }),
    fields: {
      cards(existingCards = [], { readField }) {
        return existingCards.filter(
          (cardRef) => readField('id', cardRef) !== cardId,
        );
      },
    },
    optimistic: true,
  });
}

export function useArchiveCard({
  source = 'cardView',
  shouldShowFlag = true,
  targetCardId,
}: {
  source?: SourceType;
  shouldShowFlag?: boolean;
  targetCardId?: string;
} = {}) {
  const boardId = useBoardId();
  const contextCardId = useCardId();
  const cardId = targetCardId ?? contextCardId;
  const isInbox = useIsInboxBoard();
  const containerType = isInbox ? 'inbox' : undefined;
  const { data: card } = useQuickCardEditorCardFrontFragment({
    from: { id: cardId },
    optimistic: true,
  });
  const cardRole = card?.cardRole ?? null;

  const [archiveCardMutation] = useArchiveCardMutation();

  const archiveCard = useCallback(async () => {
    const taskName = isInbox ? 'edit-inbox-card/archive' : 'edit-card/closed';
    const traceId = Analytics.startTask({ taskName, source });

    try {
      let resolvedCardId = cardId;
      if (optimisticIdManager.isOptimisticId(cardId)) {
        // Optimistically remove the optimistic card from the board in cache:
        removeArchivedCardFromBoardInCache(cardId, boardId);
        // Ensure that the archive operation has a non-optimistic card ID:
        resolvedCardId = await optimisticIdManager.waitForId(cardId);
      }

      ActionHistory.append(
        { type: 'archive' },
        {
          idCard: resolvedCardId,
          idBoard: boardId,
          idLabels: [],
          idList: '',
          idMembers: [],
        },
      );

      const dateClosedForCache = new Date().toISOString();

      await archiveCardMutation({
        variables: {
          cardId: resolvedCardId,
          dateClosed: dateClosedForCache,
          traceId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          archiveCard: {
            __typename: 'Card',
            id: resolvedCardId,
            idBoard: boardId,
            closed: true,
            dateClosed: dateClosedForCache,
          },
        },
        update(_, { data: optimisticData }) {
          const archivedCard = optimisticData?.archiveCard;

          if (!archivedCard) {
            return;
          }

          removeArchivedCardFromBoardInCache(archivedCard.id, boardId);
        },
      });

      Analytics.taskSucceeded({ taskName, traceId, source });

      if (shouldShowFlag) {
        const dismissFlag = showFlag({
          id: 'card-archived',
          title: intl.formatMessage({
            id: 'templates.shortcuts.card-archived',
            defaultMessage: 'Card archived',
            description:
              'Notification for archived card using keyboard shortcut.',
          }),
          appearance: 'normal',
          msTimeout: 8000,
          actions: [
            {
              content: intl.formatMessage({
                id: 'templates.shortcuts.undo',
                defaultMessage: 'Undo',
                description:
                  'Reverses previous action using keyboard shortcuts.',
              }),
              onClick: () => {
                undoAction({
                  source: getScreenFromUrl(),
                  idCard: resolvedCardId,
                });
                dismissFlag();
              },
              type: 'button',
            },
          ],
        });
      } else {
        // Inject message to live region for screen readers
        announceToLiveRegion(
          intl.formatMessage(
            {
              id: 'templates.shortcuts.card-archived-announcement',
              defaultMessage: 'The card {cardName} was archived',
              description:
                'The message to announce by the screen reader when a card is archived',
            },
            { cardName: card?.name || '' },
          ),
        );
      }

      Analytics.sendUpdatedCardFieldEvent({
        field: 'closed',
        source: 'cardView',
        containers: formatContainers({ idCard: resolvedCardId, boardId }),
        attributes: { taskId: traceId },
      });

      Analytics.sendTrackEvent({
        action: 'archived',
        actionSubject: 'card',
        source,
        containers: formatContainers({ idCard: resolvedCardId, boardId }),
        attributes: { containerType, cardRole },
      });
      return { success: true };
    } catch (err) {
      Analytics.taskFailed({
        taskName,
        traceId,
        source: 'cardView',
        error: err,
      });
      return { success: false };
    }
  }, [
    source,
    cardId,
    boardId,
    archiveCardMutation,
    shouldShowFlag,
    containerType,
    cardRole,
    isInbox,
    card?.name,
  ]);

  return archiveCard;
}
