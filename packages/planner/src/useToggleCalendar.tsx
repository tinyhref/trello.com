import { useCallback } from 'react';

import type { Account } from './Planner.types';
import { useTrelloTogglePlannerCalendarMutation } from './TrelloTogglePlannerCalendarMutation.generated';
import { usePlannerAccounts } from './usePlannerAccounts';
import { useWorkspaceAri } from './useWorkspaceAri';

/**
 * Toggles a calendar's visibility on or off.
 *
 * @returns - A function that handles the calendar toggling.
 * @returns {string | undefined} - The calendar id of the calendar being toggled.
 */
export const useToggleCalendar = () => {
  const { workspaceAri } = useWorkspaceAri();
  const { getEnabledCalendarsForAccount } = usePlannerAccounts();

  const [togglePlannerCalendar, { loading }] =
    useTrelloTogglePlannerCalendarMutation();

  const toggleCalendar = useCallback(
    async ({
      account,
      end,
      newCheckedState,
      providerCalendarId,
      start,
      traceId,
    }: {
      account: Account;
      end: string;
      newCheckedState: boolean;
      providerCalendarId: string;
      start: string;
      traceId?: string;
    }): Promise<string | undefined> => {
      if (
        loading ||
        !account?.accountType ||
        !account?.id ||
        !providerCalendarId ||
        !workspaceAri
      ) {
        return;
      }

      const enabledCalendars = getEnabledCalendarsForAccount(account.id);

      const calendarId = enabledCalendars?.find(
        (edge) => edge?.providerCalendarId === providerCalendarId,
      )?.id;

      const toggledCalendar = await togglePlannerCalendar({
        variables: {
          enabled: newCheckedState,
          providerAccountId: account.id,
          providerCalendarId,
          workspaceId: workspaceAri,
          type: account.accountType,
          start,
          end,
        },
        context: {
          traceId,
        },
        // Apollo doesn't allow you to optimistically use cache.evict so we have to use modify to evict
        // https://github.com/apollographql/apollo-client/issues/10289
        ...(!newCheckedState &&
          calendarId && {
            optimisticResponse: {
              __typename: 'Mutation',
              trello: {
                __typename: 'TrelloMutationApi',
                createOrUpdatePlannerCalendar: {
                  errors: null,
                  plannerCalendarMutated: {
                    __typename: 'TrelloPlannerCalendarDeleted',
                    id: calendarId,
                  },
                  success: true,
                  __typename: 'TrelloCreateOrUpdatePlannerCalendarPayload',
                },
              },
            },
            update: (cache, { data }) => {
              if (data?.trello?.createOrUpdatePlannerCalendar?.success) {
                cache.modify({
                  id: cache.identify({
                    __typename: 'TrelloPlannerCalendar',
                    id: calendarId,
                  }),
                  fields: (_, { DELETE }) => DELETE,
                });
              }
            },
          }),
      });

      // Dont set the toggled calendar id if we are toggling off a calendar
      if (
        !(
          toggledCalendar.data?.trello.createOrUpdatePlannerCalendar
            ?.plannerCalendarMutated?.__typename ===
          'TrelloPlannerCalendarDeleted'
        )
      ) {
        return toggledCalendar.data?.trello.createOrUpdatePlannerCalendar
          ?.plannerCalendarMutated?.enabledCalendars?.edges?.[0].node?.id;
      }
    },
    [
      loading,
      workspaceAri,
      togglePlannerCalendar,
      getEnabledCalendarsForAccount,
    ],
  );

  return { toggleCalendar };
};
