import type { TrelloCreateCalendarEventMutation } from '../TrelloCreateCalendarEventMutation.generated';

export const createCardBasedOptimisticResponse = ({
  plannerCalendarId,
  optimisticEventPrefix,
  eventCardId,
  focusEventName,
  eventStart,
  eventEnd,
  cardAri,
  cardObjectId,
}: {
  plannerCalendarId: string;
  optimisticEventPrefix: string;
  eventCardId: string;
  focusEventName: string;
  eventStart: string;
  eventEnd: string;
  cardAri: string;
  cardObjectId: string;
}): TrelloCreateCalendarEventMutation => ({
  __typename: 'Mutation',
  trello: {
    __typename: 'TrelloMutationApi',
    createPlannerCalendarEvent: {
      __typename: 'TrelloCreatePlannerCalendarEventPayload',
      success: true,
      errors: null,
      plannerCalendarUpdated: {
        __typename: 'TrelloPlannerCalendar',
        id: plannerCalendarId,
        events: {
          __typename: 'TrelloPlannerCalendarEventConnection',
          edges: [
            {
              __typename: 'TrelloPlannerCalendarEventEdge',
              node: {
                __typename: 'TrelloPlannerCalendarEvent',
                id: `${optimisticEventPrefix}${eventCardId}-${Date.now().toString(36)}`,
                title: focusEventName,
                startAt: eventStart,
                endAt: eventEnd,
                allDay: false,
                cards: {
                  __typename: 'TrelloPlannerCalendarEventCardConnection',
                  edges: [
                    {
                      __typename: 'TrelloPlannerCalendarEventCardEdge',
                      node: {
                        __typename: 'TrelloPlannerCalendarEventCard',
                        id: cardAri,
                        card: {
                          __typename: 'TrelloCard',
                          id: cardAri,
                          objectId: cardObjectId,
                          name: focusEventName,
                        },
                        position: 0,
                      },
                    },
                  ],
                },
                color: 'PURPLE_SUBTLEST',
                conferencing: null,
                eventType: 'PLANNER_EVENT',
                link: null,
                parentEventId: null,
                plannerCalendarId,
                status: 'ACCEPTED',
              },
            },
          ],
        },
      },
    },
  },
});

export const createFocusTimeOptimisticResponse = ({
  plannerCalendarId,
  optimisticEventPrefix,
  focusEventName,
  eventStart,
  eventEnd,
}: {
  plannerCalendarId: string;
  optimisticEventPrefix: string;
  focusEventName: string;
  eventStart: string;
  eventEnd: string;
}): TrelloCreateCalendarEventMutation => ({
  __typename: 'Mutation',
  trello: {
    __typename: 'TrelloMutationApi',
    createPlannerCalendarEvent: {
      __typename: 'TrelloCreatePlannerCalendarEventPayload',
      success: true,
      errors: null,
      plannerCalendarUpdated: {
        __typename: 'TrelloPlannerCalendar',
        id: plannerCalendarId,
        events: {
          __typename: 'TrelloPlannerCalendarEventConnection',
          edges: [
            {
              __typename: 'TrelloPlannerCalendarEventEdge',
              node: {
                __typename: 'TrelloPlannerCalendarEvent',
                id: `${optimisticEventPrefix}focus-time-${Date.now().toString(36)}`,
                title: focusEventName,
                startAt: eventStart,
                endAt: eventEnd,
                allDay: false,
                cards: {
                  __typename: 'TrelloPlannerCalendarEventCardConnection',
                  edges: [],
                },
                color: 'PURPLE_SUBTLEST',
                conferencing: null,
                eventType: 'PLANNER_EVENT',
                link: null,
                parentEventId: null,
                plannerCalendarId,
                status: 'ACCEPTED',
              },
            },
          ],
        },
      },
    },
  },
});

// Export the main function for the file naming convention
export const createOptimisticResponses = {
  createCardBasedOptimisticResponse,
  createFocusTimeOptimisticResponse,
};
