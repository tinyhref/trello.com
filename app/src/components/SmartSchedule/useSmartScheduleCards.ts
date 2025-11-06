import { useCallback, useRef } from 'react';

import { TrelloCardAri } from '@atlassian/ari';
import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { getTrelloCardDataFromCardId } from '@trello/business-logic-react/card';
import {
  smartScheduledCardsSharedState,
  type SmartScheduledCardPlannerEvent,
} from '@trello/business-logic/planner';
import { showFlag } from '@trello/nachos/experimental-flags';
import { PLANNER_CONSTANTS } from '@trello/planner';
import { useSharedStateSelector } from '@trello/shared-state';
import {
  useIsPlannerPanelOpen,
  useSplitScreenSharedState,
} from '@trello/split-screen';

import { bulkActionSelectedCardsSharedState } from 'app/src/components/BulkAction/bulkActionSelectedCardsSharedState';
import { useTrelloSmartScheduleCardsMutation } from './TrelloSmartScheduleCardsMutation.generated';
import { useTrelloSmartScheduleCardsWithSmartSelectionMutation } from './TrelloSmartScheduleCardsWithSmartSelectionMutation.generated';

export interface SmartScheduleCardsArgs {
  cardId?: string;
  smartSelection?: boolean;
  source?: SourceType;
}

/**
 * Smart schedule cards via bulk action/quick card editor.
 * @returns A function that handles smart scheduling cards, and a reference to the trace ID.
 * The function takes the following optional arguments:
 * @param cardId - The ID of the card to schedule if only one card is being scheduled.
 * @param smartSelection - Whether to use smart selection. Defaults to false.
 * @param source - The source of the smart scheduling. Defaults to 'bulkActionIsland'.
 */
export const useSmartScheduleCards = () => {
  const [smartScheduleCards] = useTrelloSmartScheduleCardsMutation();
  const [smartScheduleCardsWithSmartSelection] =
    useTrelloSmartScheduleCardsWithSmartSelectionMutation();

  const { togglePlanner } = useSplitScreenSharedState();
  const isPlannerPanelOpen = useIsPlannerPanelOpen();

  const selectedCardIds = useSharedStateSelector(
    bulkActionSelectedCardsSharedState,
    useCallback((state) => {
      const cardIds: string[] = [];
      Object.values(state.selectedCards).forEach((cards) => {
        Object.entries(cards).forEach(([cardId, isSelected]) => {
          if (isSelected) {
            cardIds.push(cardId);
          }
        });
      });
      return cardIds;
    }, []),
  );

  const smartScheduleTraceId = useRef<string | undefined>(undefined);

  const handleSmartScheduleCards = useCallback(
    async ({
      cardId,
      smartSelection = false,
      source = 'bulkActionIsland',
    }: SmartScheduleCardsArgs) => {
      const cardIds = cardId ? [cardId] : selectedCardIds;

      if (!smartSelection && cardIds.length < 1) {
        return;
      }

      const offsetMinutes = new Date().getTimezoneOffset();
      const offsetHours = -offsetMinutes / 60;

      const startDate = new Date();
      const endDate = smartSelection
        ? new Date(new Date().setHours(23, 59, 59, 999))
        : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      const traceId = Analytics.startTask({
        taskName: 'edit-plannerEvent/smartSchedule',
        source,
      });

      smartScheduleTraceId.current = traceId;

      try {
        smartScheduledCardsSharedState.setValue({
          ...smartScheduledCardsSharedState.value,
          isLoading: true,
        });

        const proposedEvents: SmartScheduledCardPlannerEvent[] = [];

        if (smartSelection && cardIds.length === 0) {
          const { data } = await smartScheduleCardsWithSmartSelection({
            variables: {
              timezoneOffsetHours: offsetHours,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            },
            context: {
              traceId,
            },
          });

          data?.trello?.smartScheduleCardsWithSmartSelection?.events?.forEach(
            (event) => {
              const card = event?.cards?.[0];
              if (!card) {
                return;
              }
              const cardIdFromEvent = TrelloCardAri.parse(card.id).cardId;
              proposedEvents.push({
                id: cardIdFromEvent,
                start: event.startTime,
                end: event.endTime,
                eventId:
                  PLANNER_CONSTANTS.PROPOSED_EVENT_ID_PREFIX + cardIdFromEvent,
                title: card.name,
                durationEditable: true,
                startEditable: true,
              } as SmartScheduledCardPlannerEvent);
            },
          );
        } else {
          const cardAris = cardIds.map(
            (id) => getTrelloCardDataFromCardId(id).cardAri,
          );

          const { data } = await smartScheduleCards({
            variables: {
              cardIds: cardAris,
              timezoneOffsetHours: offsetHours,
              // the resolver does not currently use these dates but will in the future
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            },
            context: {
              traceId,
            },
          });

          data?.trello?.smartScheduleCards?.events?.forEach((event) => {
            const card = event?.cards?.[0];
            if (!card) {
              return;
            }
            const cardIdFromEvent = TrelloCardAri.parse(card.id).cardId;
            proposedEvents.push({
              id: cardIdFromEvent,
              start: event.startTime,
              end: event.endTime,
              eventId:
                PLANNER_CONSTANTS.PROPOSED_EVENT_ID_PREFIX + cardIdFromEvent,
              title: card.name,
              durationEditable: true,
              startEditable: true,
            } as SmartScheduledCardPlannerEvent);
          });
        }

        smartScheduledCardsSharedState.setValue({
          activeIndex: 0,
          isLoading: false,
          proposedEvents: [
            ...smartScheduledCardsSharedState.value.proposedEvents,
            ...proposedEvents,
          ],
        });

        bulkActionSelectedCardsSharedState.setValue(() => ({
          selectedCards: {},
          isLoading: false,
        }));

        if (proposedEvents?.length && !isPlannerPanelOpen) {
          togglePlanner();
        }

        Analytics.taskSucceeded({
          taskName: 'edit-plannerEvent/smartSchedule',
          traceId,
          source,
        });
      } catch (error) {
        smartScheduledCardsSharedState.setValue({
          ...smartScheduledCardsSharedState.value,
          isLoading: false,
        });

        showFlag({
          id: 'smartScheduleError',
          title: 'There was an error scheduling focus time. Please try again.',
          appearance: 'error',
          isAutoDismiss: true,
        });

        Analytics.taskFailed({
          taskName: 'edit-plannerEvent/smartSchedule',
          traceId,
          source,
          error,
        });
      }
    },
    [
      isPlannerPanelOpen,
      selectedCardIds,
      smartScheduleCards,
      smartScheduleCardsWithSmartSelection,
      togglePlanner,
    ],
  );

  return { handleSmartScheduleCards, smartScheduleTraceId };
};
