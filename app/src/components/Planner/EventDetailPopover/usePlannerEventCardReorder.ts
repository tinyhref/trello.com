import { useCallback, useMemo } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { sendErrorEvent } from '@trello/error-reporting';
import { useWorkspaceAri } from '@trello/planner';
import { calculateItemPosition } from '@trello/position';

import { useTrelloUpdateCardPositionOnPlannerEventMutation } from '../TrelloUpdateCardPositionOnPlannerEventMutation.generated';
import { useSortedPlannerEventCards } from '../useSortedPlannerEventCards';

interface ReorderCardArgs {
  cardId: string;
  newIndex: number;
}

export const usePlannerEventCardReorder = () => {
  const { workspaceId } = useWorkspaceAri();
  const associatedCardsData = useSortedPlannerEventCards();
  const associatedCards = useMemo(
    () => associatedCardsData?.cards?.edges || [],
    [associatedCardsData?.cards?.edges],
  );

  const taskName = 'edit-plannerEvent/cardOrder';

  const [updateCardPosition] =
    useTrelloUpdateCardPositionOnPlannerEventMutation();

  const reorderCard = useCallback(
    async ({ cardId, newIndex }: ReorderCardArgs) => {
      const currentCardIndex = associatedCards.findIndex(
        (edge) => edge?.node?.card?.objectId === cardId,
      );

      if (currentCardIndex === -1) {
        return;
      }

      if (currentCardIndex === newIndex) {
        return;
      }

      const traceId = Analytics.startTask({
        taskName,
        source: 'eventDetailScreen',
      });

      try {
        const newPosition = calculateItemPosition(
          newIndex,
          associatedCards.map((edge) => ({
            id: edge?.node?.card?.objectId || '',
            pos: edge?.node?.position || 0,
          })),
          {
            id: cardId,
            pos: associatedCards[currentCardIndex]?.node?.position || 0,
          },
        );

        const plannerEventCard = associatedCards[currentCardIndex]?.node;
        if (!plannerEventCard?.id) {
          return;
        }

        await updateCardPosition({
          variables: {
            plannerCalendarEventCardId: plannerEventCard.id,
            position: newPosition,
          },
          context: {
            traceId,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            trello: {
              __typename: 'TrelloMutationApi',
              updateCardPositionOnPlannerCalendarEvent: {
                __typename:
                  'TrelloUpdateCardPositionOnPlannerCalendarEventPayload',
                success: true,
                errors: null,
                eventCard: {
                  __typename: 'TrelloPlannerCalendarEventCard',
                  id: plannerEventCard.id,
                  position: newPosition,
                  card: plannerEventCard.card,
                },
              },
            },
          },
        });

        Analytics.sendUIEvent({
          action: 'reordered',
          actionSubject: 'card',
          source: 'eventDetailScreen',
          attributes: {
            personalProductivity: 'planner',
            containerType: 'planner',
            cardId,
            fromIndex: String(currentCardIndex),
            toIndex: String(newIndex),
            taskId: traceId,
          },
          containers: formatContainers({ workspaceId }),
        });

        Analytics.taskSucceeded({
          taskName,
          source: 'eventDetailScreen',
          traceId,
        });
      } catch (error) {
        Analytics.taskFailed({
          taskName,
          source: 'eventDetailScreen',
          traceId,
          error,
        });

        sendErrorEvent(error, {
          tags: {
            ownershipArea: 'trello-electric',
            feature: 'Planner',
          },
          extraData: {
            component: 'usePlannerEventCardReorder',
            cardId,
            newIndex: String(newIndex),
            currentIndex: String(currentCardIndex),
          },
        });
      }
    },
    [associatedCards, updateCardPosition, workspaceId],
  );

  return { reorderCard };
};
