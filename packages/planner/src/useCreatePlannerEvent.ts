import { addMinutes } from 'date-fns';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import type { EventAttributes, SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useMemberId } from '@trello/authentication';
import { getTrelloCardDataFromCardId } from '@trello/business-logic-react/card';
import { sendErrorEvent } from '@trello/error-reporting';
import { client } from '@trello/graphql';
import { showFlag } from '@trello/nachos/experimental-flags';
import { getSmartCardClient } from '@trello/smart-card/smart-card-client';

import {
  createCardBasedOptimisticResponse,
  createFocusTimeOptimisticResponse,
} from './utils/createOptimisticResponses';
import { getIsInboxBoard } from './utils/getIsInboxBoard';
import {
  PlannerCardDataFragmentDoc,
  type PlannerCardDataFragment,
} from './PlannerCardDataFragment.generated';
import { PLANNER_CONSTANTS } from './plannerConstants';
import { useTrelloCreateCalendarEventMutation } from './TrelloCreateCalendarEventMutation.generated';
import { useEventAccountCalendarForCreate } from './useEventAccountCalendarForCreate';
import { usePlannerAccounts } from './usePlannerAccounts';
import { usePlannerRef } from './usePlannerRef';
import { useWorkspaceAri } from './useWorkspaceAri';

export type UseCreatePlannerEventArgs = {
  source: SourceType;
  optimisticEventPrefix: string;
};

type CreatePlannerEventArgs = {
  startDate?: Date | null;
  endDate?: Date | null;
  eventCardId?: string;
};

const taskName = 'create-plannerEvent';

/**
 * Hook for creating Planner events.
 *
 * This hook returns a callback function that handles the creation of planner events,
 * including automatic calendar selection and error handling.
 *
 * @param {Object} args - The arguments for the hook.
 * @param {SourceType} args.source - The analytics source for the event.
 * @param {string} args.optimisticEventPrefix - Prefix for optimistic event IDs.
 * @returns {Function} A callback function to create a planner event.
 */
export const useCreatePlannerEvent = ({
  source,
  optimisticEventPrefix,
}: UseCreatePlannerEventArgs): (({
  startDate,
  endDate,
  eventCardId,
}: CreatePlannerEventArgs) => Promise<void>) => {
  const intl = useIntl();
  const memberId = useMemberId();
  const { plannerRef } = usePlannerRef();
  const { workspaceId } = useWorkspaceAri();

  const { primaryAccountId } = usePlannerAccounts();
  const getEventAccountCalendarForCreate = useEventAccountCalendarForCreate();

  const [createCalendarEvent] = useTrelloCreateCalendarEventMutation();

  const isPlannerCacheCold = !primaryAccountId;

  return useCallback(
    async ({
      startDate,
      endDate,
      eventCardId,
    }: CreatePlannerEventArgs): Promise<void> => {
      const calendarApi = plannerRef.current?.getApi();

      const isDndEvent =
        PLANNER_CONSTANTS.DND_TEMP_EVENT_ID_PREFIX === optimisticEventPrefix;
      const hasCalendarViewDates =
        !!calendarApi?.view.currentStart && !!calendarApi?.view.currentEnd;

      if (!startDate) {
        return;
      }

      const { plannerCalendarId, providerAccountId } =
        await getEventAccountCalendarForCreate(optimisticEventPrefix);

      if (!plannerCalendarId || !providerAccountId) {
        return;
      }

      const traceId = Analytics.startTask({
        taskName,
        source,
      });

      let cardData: PlannerCardDataFragment | null = null;
      let boardId = '';
      let isInboxBoard = false;
      let uiEventAttributes: EventAttributes;

      if (eventCardId) {
        cardData = client.readFragment<PlannerCardDataFragment>({
          id: client.cache.identify({
            __typename: 'Card',
            id: eventCardId,
          }),
          fragment: PlannerCardDataFragmentDoc,
        });
        boardId = cardData?.idBoard || '';
        isInboxBoard = getIsInboxBoard(memberId, boardId);

        uiEventAttributes = {
          personalProductivity: 'planner',
          containerType: 'planner',
          cardId: eventCardId,
          source: isInboxBoard ? 'inbox' : 'board',
          action: 'schedule',
          taskId: traceId,
        };
      } else {
        uiEventAttributes = {
          personalProductivity: 'planner',
          containerType: 'planner',
          taskId: traceId,
        };
      }

      if (isDndEvent) {
        Analytics.sendUIEvent({
          action: 'dropped',
          actionSubject: 'card',
          source,
          attributes: uiEventAttributes,
          containers: formatContainers({ workspaceId }),
        });
      } else {
        const buttonName = eventCardId
          ? 'addPlannerEventFromCardSaveButton'
          : 'saveButton';

        Analytics.sendClickedButtonEvent({
          buttonName,
          source,
          attributes: uiEventAttributes,
          containers: formatContainers({ workspaceId }),
        });
      }

      try {
        let focusEventName: string;
        let cardAri: string | undefined;
        let cardObjectId: string | undefined = undefined;

        if (eventCardId) {
          const {
            cardAri: extractedCardAri,
            cardName,
            cardRole,
            cardObjectId: extractedCardObjectId,
          } = getTrelloCardDataFromCardId(eventCardId);
          focusEventName = cardName || '';
          cardAri = extractedCardAri;
          cardObjectId = extractedCardObjectId || undefined;

          const smartCardClient = getSmartCardClient();
          if (cardRole === 'link') {
            const fetchLinkCardName = async () => {
              const resolved = await smartCardClient
                .fetchData(cardName || '')
                .catch(() => {});
              if (resolved?.data && 'name' in resolved.data) {
                focusEventName = resolved.data.name || '';
              }
            };
            await fetchLinkCardName();
          }

          if (!focusEventName) {
            focusEventName = intl.formatMessage({
              id: 'templates.planner.focus-time',
              defaultMessage: 'Focus time',
              description:
                'Default title for new planner events when a fallback is needed',
            });
          }
        } else {
          focusEventName = intl.formatMessage({
            id: 'templates.planner.focus-time',
            defaultMessage: 'Focus time',
            description:
              'Default title for new planner events when a fallback is needed',
          });
        }

        const eventStart = startDate.toISOString();
        const eventEnd = endDate
          ? endDate.toISOString()
          : addMinutes(
              startDate,
              PLANNER_CONSTANTS.DND_NEW_EVENT_DURATION_IN_MINUTES,
            ).toISOString();

        const optimisticResponse = hasCalendarViewDates
          ? eventCardId
            ? createCardBasedOptimisticResponse({
                plannerCalendarId,
                optimisticEventPrefix,
                eventCardId,
                focusEventName,
                eventStart,
                eventEnd,
                cardAri: cardAri!,
                cardObjectId: cardObjectId!,
              })
            : createFocusTimeOptimisticResponse({
                plannerCalendarId,
                optimisticEventPrefix,
                focusEventName,
                eventStart,
                eventEnd,
              })
          : undefined;

        await createCalendarEvent({
          variables: {
            start: calendarApi?.view.currentStart.toISOString() || '',
            end: calendarApi?.view.currentEnd.toISOString() || '',
            plannerCalendarId,
            providerAccountId,
            event: {
              title: focusEventName,
              ...(cardAri && { cardId: cardAri }),
              start: eventStart,
              end: eventEnd,
            },
          },
          context: {
            traceId,
          },
          optimisticResponse,
          // When creating an event with Planner closed and the cache is cold,
          // we don't want to write a null `start` and `end` window to the `events:{}`
          // key in the cache.
          fetchPolicy: isPlannerCacheCold ? 'no-cache' : undefined,
        });

        Analytics.sendTrackEvent({
          action: 'created',
          actionSubject: 'plannerEvent',
          source,
          attributes: {
            personalProductivity: 'planner',
            containerType: 'planner',
            method: isDndEvent
              ? 'dnd'
              : eventCardId
                ? 'cardQuickActions'
                : 'popover',
            taskId: traceId,
          },
          containers: formatContainers({
            workspaceId,
          }),
        });

        Analytics.taskSucceeded({ taskName, source, traceId });
      } catch (error) {
        Analytics.taskFailed({ taskName, source, traceId, error });

        const tempEvent = calendarApi?.getEventById(
          `${optimisticEventPrefix}${eventCardId || 'focus-time'}`,
        );

        if (tempEvent) {
          try {
            tempEvent.remove();
          } catch (removeError) {
            sendErrorEvent(removeError, {
              tags: {
                ownershipArea: 'trello-electric',
                feature: 'Planner',
              },
              extraData: {
                component: isDndEvent
                  ? 'useHandleDrop'
                  : eventCardId
                    ? 'AddCardToPlannerPopover'
                    : 'EventDetailPopoverFooter',
              },
            });

            throw removeError;
          }
        }

        const errorMessage = eventCardId
          ? intl.formatMessage({
              id: 'templates.planner.add-card-to-event-error',
              defaultMessage:
                'We weren’t able to add an event for this card. Please try again.',
              description: 'Error flag message for creating a calendar event',
            })
          : intl.formatMessage({
              id: 'templates.planner.create-calendar-focus-event-error',
              defaultMessage:
                'We weren’t able to add focus time. Please try again.',
              description: 'Error flag message for creating a calendar event',
            });

        showFlag({
          id: 'plannerCreateEventError',
          title: errorMessage,
          appearance: 'error',
          isAutoDismiss: true,
        });
      }
    },
    [
      plannerRef,
      optimisticEventPrefix,
      getEventAccountCalendarForCreate,
      source,
      memberId,
      workspaceId,
      createCalendarEvent,
      isPlannerCacheCold,
      intl,
    ],
  );
};
